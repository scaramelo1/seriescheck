import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espaco } from '../tema';

export function Carregando() {
  return (
    <View style={estilos.centro}>
      <ActivityIndicator color={cores.destaque} size="large" />
    </View>
  );
}

export function Aviso({ texto, acao, aoTocar }: { texto: string; acao?: string; aoTocar?: () => void }) {
  return (
    <View style={estilos.centro}>
      <Text style={estilos.aviso}>{texto}</Text>
      {acao && <Botao texto={acao} aoTocar={aoTocar} />}
    </View>
  );
}

export function Botao({
  texto,
  aoTocar,
  secundario,
}: {
  texto: string;
  aoTocar?: () => void;
  secundario?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={aoTocar}
      style={({ pressed }) => [estilos.botao, secundario && estilos.botaoSecundario, pressed && { opacity: 0.7 }]}
    >
      <Text style={[estilos.botaoTexto, secundario && { color: cores.texto }]}>{texto}</Text>
    </Pressable>
  );
}

export function Chip({ texto, ativo, aoTocar }: { texto: string; ativo: boolean; aoTocar: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
      onPress={aoTocar}
      style={[estilos.chip, ativo && estilos.chipAtivo]}
    >
      <Text style={[estilos.chipTexto, ativo && { color: cores.sobreDestaque }]}>{texto}</Text>
    </Pressable>
  );
}

export function BarraProgresso({ percentual }: { percentual: number }) {
  const cor = percentual === 100 ? cores.concluido : cores.destaque;
  return (
    <View style={estilos.barra}>
      <View style={[estilos.barraCheia, { width: `${percentual}%`, backgroundColor: cor }]} />
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: espaco.g, minHeight: 240 },
  aviso: { color: cores.textoSuave, fontSize: 15, textAlign: 'center', marginBottom: espaco.m, lineHeight: 22 },
  botao: {
    backgroundColor: cores.destaque,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: espaco.m,
    alignItems: 'center',
  },
  botaoSecundario: { backgroundColor: 'transparent', borderWidth: 1, borderColor: cores.borda },
  botaoTexto: { color: cores.sobreDestaque, fontWeight: '700', fontSize: 14 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  chipAtivo: { backgroundColor: cores.destaque, borderColor: cores.destaque },
  chipTexto: { color: cores.textoSuave, fontWeight: '600', fontSize: 13 },
  barra: { height: 6, borderRadius: 3, backgroundColor: cores.borda, overflow: 'hidden' },
  barraCheia: { height: '100%', borderRadius: 3 },
});
