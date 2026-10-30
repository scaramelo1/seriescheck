import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

import { t } from '../../i18n';
import { cores } from '../../tema';

type NomeIcone = ComponentProps<typeof Ionicons>['name'];

// A tab bar sempre passa a cor como string; o tipo ColorValue do RN inclui null.
const icone =
  (nome: NomeIcone) =>
  ({ color, size }: { color: unknown; size: number }) => <Ionicons name={nome} color={color as string} size={size} />;

export default function AbasLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: cores.primaria },
        headerTintColor: '#fff',
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSuave,
        tabBarStyle: { backgroundColor: cores.primaria, borderTopColor: cores.borda },
        sceneStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.abaExplorar,
          headerTitle: () => (
            <Image
              source={require('../../../assets/logo-nome.png')}
              style={{ width: 148, height: 27 }}
              contentFit="contain"
              accessibilityLabel="SeriesCheck"
            />
          ),
          tabBarIcon: icone('compass'),
        }}
      />
      <Tabs.Screen name="lista" options={{ title: t.abaLista, tabBarIcon: icone('checkmark-done') }} />
    </Tabs>
  );
}
