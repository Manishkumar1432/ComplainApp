import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import '../src/utils/webFix';
// app/_layout.tsx



export const unstable_settings = {
  initialRouteName: 'index',
};

function RootLayoutContent() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {!token ? (
        <>
          <Stack.Screen name="index" options={{ title: 'Signup' }} />
          <Stack.Screen name="signup" options={{ title: 'Signup' }} />
          <Stack.Screen name="login" options={{ title: 'Login' }} />
        </>
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
