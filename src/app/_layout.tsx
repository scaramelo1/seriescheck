import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { migrar } from '../db/migracoes';
import { cores } from '../tema';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="seriescheck.db" onInit={migrar}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="(abas)" options={{ headerShown: false }} />
        <Stack.Screen name="serie/[id]" options={{ title: '' }} />
      </Stack>
    </SQLiteProvider>
  );
}
