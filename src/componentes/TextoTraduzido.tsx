import { useState } from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { useTraducao } from '../hooks/useTraducao';
import { t } from '../i18n';
import { cores } from '../tema';

interface Props {
  texto: string;
  aberto: boolean;
  linhasFechado: number;
  style: StyleProp<TextStyle>;
  aoTocar?: () => void;
}

/** Mostra o texto no idioma do celular quando há tradução, com opção de ver o original. */
export function TextoTraduzido({ texto, aberto, linhasFechado, style, aoTocar }: Props) {
  const traduzido = useTraducao(texto, aberto);
  const [original, setOriginal] = useState(false);

  return (
    <>
      <Text style={style} numberOfLines={aberto ? undefined : linhasFechado} onPress={aoTocar}>
        {traduzido && !original ? traduzido : texto}
      </Text>
      {traduzido && aberto && (
        <Text style={estilos.aviso} onPress={() => setOriginal((o) => !o)}>
          {t.traducaoAutomatica} · <Text style={estilos.link}>{original ? t.verTraducao : t.verOriginal}</Text>
        </Text>
      )}
    </>
  );
}

const estilos = StyleSheet.create({
  aviso: { color: cores.textoSuave, fontSize: 11, marginTop: 6 },
  link: { color: cores.destaque, fontWeight: '700' },
});
