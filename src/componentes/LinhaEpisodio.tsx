import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatarData } from '../dominio/texto';
import type { Episodio } from '../dominio/tipos';
import { idiomaCelular, t } from '../i18n';
import { cores, espaco } from '../tema';
import { TextoTraduzido } from './TextoTraduzido';

interface Props {
  episodio: Episodio;
  assistido: boolean;
  aoAlternar: (id: number) => void;
  aoSegurar: (episodio: Episodio) => void;
}

function LinhaEpisodioBase({ episodio: ep, assistido, aoAlternar, aoSegurar }: Props) {
  const [aberto, setAberto] = useState(false);
  const data = ep.exibidoEm && formatarData(ep.exibidoEm, idiomaCelular);
  const codigo = t.codigoEp(ep.temporada, ep.numero);

  return (
    <Pressable
      onPress={() => setAberto((a) => !a)}
      style={[estilos.linha, assistido && estilos.assistido]}
      accessibilityHint={t.mostrarResumo}
    >
      <View style={estilos.topo}>
        <Image
          source={ep.imagem}
          recyclingKey={String(ep.id)}
          style={estilos.imagem}
          contentFit="cover"
          transition={150}
        />
        <View style={estilos.corpo}>
          <Text style={estilos.numero}>
            {codigo}
            {data ? ` · ${data}` : ''}
          </Text>
          <Text style={estilos.titulo} numberOfLines={aberto ? undefined : 2}>
            {ep.titulo}
          </Text>
        </View>
        <Pressable
          disabled={!ep.liberado}
          onPress={() => aoAlternar(ep.id)}
          onLongPress={() => aoSegurar(ep)}
          hitSlop={10}
          style={estilos.tick}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: assistido, disabled: !ep.liberado }}
          accessibilityLabel={t.episodioAssistido(codigo)}
        >
          <Ionicons
            name={!ep.liberado ? 'time-outline' : assistido ? 'checkmark-circle' : 'ellipse-outline'}
            size={30}
            color={assistido ? cores.concluido : cores.textoSuave}
          />
        </Pressable>
      </View>
      {ep.resumo ? (
        <TextoTraduzido texto={ep.resumo} aberto={aberto} linhasFechado={2} style={estilos.resumo} />
      ) : null}
    </Pressable>
  );
}

export const LinhaEpisodio = memo(LinhaEpisodioBase);

const estilos = StyleSheet.create({
  linha: {
    backgroundColor: cores.cartao,
    borderRadius: 12,
    padding: 10,
    marginHorizontal: espaco.m,
    marginBottom: 10,
  },
  assistido: { opacity: 0.62 },
  topo: { flexDirection: 'row', alignItems: 'center' },
  imagem: { width: 112, height: 63, borderRadius: 8, backgroundColor: cores.borda },
  corpo: { flex: 1, marginHorizontal: 10 },
  numero: { color: cores.textoSuave, fontSize: 11, fontWeight: '700', marginBottom: 2 },
  titulo: { color: cores.texto, fontSize: 14, fontWeight: '600' },
  tick: { padding: 4 },
  resumo: { color: cores.textoSuave, fontSize: 13, lineHeight: 19, marginTop: espaco.p },
});
