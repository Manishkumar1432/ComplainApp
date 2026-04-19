import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../_contexts/AuthContext';
import { apiUrl, SOCKET_BASE_URL } from '../_utils/api';

type Sender = {
  _id: string;
  name?: string;
  email?: string;
};

type ChatMessage = {
  _id: string;
  sender: Sender;
  message: string;
  createdAt: string;
};

const Chat = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const socketRef = useRef<Socket | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(apiUrl('/chat'), {
        headers: {
          'x-auth-token': token,
        },
      });

      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Fetch chat history error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = io(SOCKET_BASE_URL, {
      transports: ['websocket'],
      auth: {
        token,
      },
      extraHeaders: {
        'x-auth-token': token,
      },
    });

    socketRef.current = socket;
    setConnectionState('connecting');

    socket.on('connect', () => {
      setConnectionState('connected');
    });

    socket.on('disconnect', () => {
      setConnectionState('disconnected');
    });

    socket.on('connect_error', () => {
      setConnectionState('disconnected');
    });

    socket.on('chat:ready', (payload: { userId?: string }) => {
      if (payload?.userId) {
        setCurrentUserId(payload.userId);
      }
    });

    socket.on('chat:message', (incoming: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((item) => item._id === incoming._id)) {
          return prev;
        }
        return [...prev, incoming];
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const sendMessage = () => {
    const message = input.trim();
    const socket = socketRef.current;

    if (!message || !socket || connectionState !== 'connected' || isSending) {
      return;
    }

    setIsSending(true);

    socket.emit('chat:message', { message }, (result: { ok: boolean; msg?: string }) => {
      setIsSending(false);
      if (result?.ok) {
        setInput('');
      } else if (result?.msg) {
        console.error('Send message failed:', result.msg);
      }
    });
  };

  const statusText = useMemo(() => {
    if (connectionState === 'connected') {
      return 'Live';
    }
    if (connectionState === 'connecting') {
      return 'Connecting...';
    }
    return 'Offline';
  }, [connectionState]);

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMine = currentUserId && item.sender?._id === currentUserId;
    return (
      <View style={[styles.messageWrap, isMine ? styles.myWrap : styles.otherWrap]}>
        {!isMine ? <Text style={styles.senderName}>{item.sender?.name || 'User'}</Text> : null}
        <Text style={[styles.messageText, isMine ? styles.myText : styles.otherText]}>{item.message}</Text>
        <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Community Chat</Text>
        <Text style={styles.status}>{statusText}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loaderText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type your message"
          value={input}
          onChangeText={setInput}
          editable={connectionState === 'connected' && !isSending}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (isSending || connectionState !== 'connected') && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={isSending || connectionState !== 'connected'}
        >
          <Text style={styles.sendBtnText}>{isSending ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  status: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  listContent: {
    padding: 12,
    paddingBottom: 20,
  },
  messageWrap: {
    maxWidth: '80%',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  myWrap: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
  },
  otherWrap: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  senderName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
  },
  myText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: '#111827',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    color: '#D1D5DB',
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 8,
    color: '#6B7280',
  },
});

export default Chat;