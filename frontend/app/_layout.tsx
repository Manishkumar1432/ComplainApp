import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from './_contexts/AuthContext';
import './_utils/webFix';



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
          <Stack.Screen name="login" options={{ title: 'Login' }} />
        </>
      ) : (
        <Stack.Screen name="Home" options={{ title: 'Home' }} />
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
