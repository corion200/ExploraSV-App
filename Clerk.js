import React from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

const CLERK_PUBLISHABLE_KEY = 'pk_test_Zml0dGluZy1zZWFsLTIyLmNsZXJrLmFjY291bnRzLmRldiQ'


export default function ClerkProviderWrapper({ children }) {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={{
        getToken: (key) => SecureStore.getItemAsync(key),
        saveToken: (key, value) => SecureStore.setItemAsync(key, value),
      }}
    >
      {children}
    </ClerkProvider>
  );
}