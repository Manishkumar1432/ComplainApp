import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = '940256905980-87ho4kkh42ubole3d4aljqc2b0veci0t.apps.googleusercontent.com';

export function useGoogleAuth(
  onSuccess: (idToken: string) => void,
  onError: (message: string) => void
) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
    redirectUri: makeRedirectUri({ useProxy: true }),
    responseType: 'id_token',
  });

  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        onSuccess(idToken);
      } else {
        onError('Google sign-in returned no ID token.');
      }
    } else if (response.type === 'error') {
      onError('Google sign-in failed. Please try again.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return {
    request,
    promptAsync,
  };
}
