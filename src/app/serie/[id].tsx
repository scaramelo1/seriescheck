import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LinhaEpisodio } from '../../componentes/LinhaEpisodio';
import { TextoTraduzido } from '../../componentes/TextoTraduzido';
import { Aviso, BarraProgresso, Botao, Carregando, Chip } from '../../componentes/ui';
import { calcularProgresso, idsAte, listarTemporadas, proximoParaAssistir } from '../../dominio/episodios';
import type { Episodio, Serie } from '../../dominio/tipos';
import { useSerie } from '../../hooks/useSerie';
import { nomeGenero, nomeStatus, t } from '../../i18n';
import { cores, espaco } from '../../tema';

export default function TelaSerie() {
  const params = useLocalSearchParams<{ id: string }>();
  const { serie, episodios, assistidos, carregando, erro, alternar, marcar, desmarcar, tentarDeNovo } = useSerie(
    Number(params.id),
  );
  const [temporada, setTemporada] = useState<number>();

  const segurar = useCallback(
    (episodio: Episodio) => {
      Alert.alert(t.marcarAteTitulo, t.marcarAteTexto(t.codigoEp(episodio.temporada, episodio.numero)), [
        { text: t.cancelar, style: 'cancel' },
        { text: t.marcar, onPress: () => marcar(idsAte(episodios, episodio)) },
      ]);
    },
    [episodios, marcar],
  );

  const proximo = useMemo(() => proximoParaAssistir(episodios, assistidos), [episodios, assistidos]);
  const temporadas = useMemo(() => listarTemporadas(episodios), [episodios]);
  const daTemporada = useMemo(() => episodios.filter((e) => e.temporada === temporada), [episodios, temporada]);

  // Abre onde o usuário parou, só uma vez: marcar o último de uma temporada não troca a tela de lugar.
  useEffect(() => {
    if (temporada === undefined && episodios.length > 0) setTemporada(proximo?.temporada ?? temporadas[0]);
  }, [episodios, proximo, temporada, temporadas]);

  if (erro) return <Aviso texto={t.erroAbrirSerie} acao={t.tentarDeNovo} aoTocar={tentarDeNovo} />;
  if (!serie) return <Carregando />;

  const pendentes = daTemporada.filter((e) => e.liberado && !assistidos.has(e.id));

  const confirmarDesmarcar = () => {
    if (temporada === undefined) return;
    Alert.alert(t.desmarcarTitulo(temporada), t.desmarcarTexto, [
      { text: t.cancelar, style: 'cancel' },
      { text: t.desmarcar, style: 'destructive', onPress: () => desmarcar(daTemporada.map((e) => e.id)) },
    ]);
  };

  const cabecalho = (
    <Cabecalho
      serie={serie}
      episodios={episodios}
      assistidos={assistidos.size}
      proximo={proximo}
      carregando={carregando}
      temporadas={temporadas}
      temporada={temporada}
      temPendentes={pendentes.length > 0}
      aoEscolherTemporada={setTemporada}
      aoMarcarProximo={() => {
        if (!proximo) return;
        setTemporada(proximo.temporada);
        alternar(proximo.id);
      }}
      aoMarcarTemporada={() => marcar(pendentes.map((e) => e.id))}
      aoDesmarcarTemporada={confirmarDesmarcar}
    />
  );

  return (
    <>
      <Stack.Screen options={{ title: serie.titulo }} />
      <FlatList
        data={daTemporada}
        extraData={assistidos}
        keyExtractor={(e) => String(e.id)}
        ListHeaderComponent={cabecalho}
        renderItem={({ item }) => (
          <LinhaEpisodio
            episodio={item}
            assistido={assistidos.has(item.id)}
            aoAlternar={alternar}
            aoSegurar={segurar}
          />
        )}
        initialNumToRender={12}
        windowSize={9}
        ListEmptyComponent={carregando ? undefined : <Aviso texto={t.semEpisodios} />}
        ListFooterComponent={<Text style={estilos.creditos}>{t.creditos}</Text>}
      />
    </>
  );
}

interface PropsCabecalho {
  serie: Serie;
  episodios: Episodio[];
  assistidos: number;
  proximo: Episodio | null;
  carregando: boolean;
  temporadas: number[];
  temporada: number | undefined;
  temPendentes: boolean;
  aoEscolherTemporada: (temporada: number) => void;
  aoMarcarProximo: () => void;
  aoMarcarTemporada: () => void;
  aoDesmarcarTemporada: () => void;
}

function Cabecalho(props: PropsCabecalho) {
  const { serie, episodios, assistidos, proximo, carregando, temporadas, temporada, temPendentes } = props;
  const [sinopseAberta, setSinopseAberta] = useState(false);
  const progresso = calcularProgresso(assistidos, episodios.length);
  const meta = [serie.canal, serie.ano, nomeStatus(serie.status), serie.nota ? `★ ${serie.nota.toFixed(1)}` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={estilos.cabecalho}>
      <Image source={serie.banner ?? serie.capa} style={estilos.banner} contentFit="cover" transition={200} />
      <View style={estilos.identidade}>
        <Image source={serie.capa} style={estilos.capa} contentFit="cover" transition={200} />
        <View style={estilos.nomes}>
          <Text style={estilos.titulo}>{serie.titulo}</Text>
          {serie.tituloAlternativo && <Text style={estilos.alternativo}>{serie.tituloAlternativo}</Text>}
          <Text style={estilos.meta}>{meta}</Text>
        </View>
      </View>

      {serie.generos.length > 0 && <Text style={estilos.generos}>{serie.generos.map(nomeGenero).join(' · ')}</Text>}
      {serie.sinopse ? (
        <View style={estilos.blocoSinopse}>
          <TextoTraduzido
            texto={serie.sinopse}
            aberto={sinopseAberta}
            linhasFechado={4}
            style={estilos.sinopse}
            aoTocar={() => setSinopseAberta((a) => !a)}
          />
        </View>
      ) : null}

      {episodios.length > 0 && (
        <>
          <View style={estilos.progresso}>
            <Text style={estilos.contagem}>
              {t.deEpisodios(progresso.assistidos, progresso.total)} · {progresso.percentual}%
            </Text>
            <BarraProgresso percentual={progresso.percentual} />
            <View style={estilos.acoes}>
              {proximo && (
                <View style={estilos.acao}>
                  <Botao
                    texto={t.assistiEp(t.codigoEp(proximo.temporada, proximo.numero))}
                    aoTocar={props.aoMarcarProximo}
                  />
                </View>
              )}
              <View style={estilos.acao}>
                {temPendentes ? (
                  <Botao texto={t.marcarTemporada} secundario aoTocar={props.aoMarcarTemporada} />
                ) : (
                  <Botao texto={t.desmarcarTemporada} secundario aoTocar={props.aoDesmarcarTemporada} />
                )}
              </View>
            </View>
            <Text style={estilos.dica}>{t.dicaSegurar}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.temporadas}>
            {temporadas.map((n) => (
              <Chip key={n} texto={t.temporada(n)} ativo={n === temporada} aoTocar={() => props.aoEscolherTemporada(n)} />
            ))}
          </ScrollView>
        </>
      )}
      {carregando && episodios.length === 0 && <Carregando />}
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: { marginBottom: espaco.p },
  banner: { width: '100%', height: 150, backgroundColor: cores.cartao },
  identidade: { flexDirection: 'row', paddingHorizontal: espaco.m, marginTop: -44 },
  capa: { width: 104, height: 148, borderRadius: 10, backgroundColor: cores.borda },
  nomes: { flex: 1, marginLeft: 14, marginTop: 52 },
  titulo: { color: cores.texto, fontSize: 19, fontWeight: '800' },
  alternativo: { color: cores.textoSuave, fontSize: 13, marginTop: 2 },
  meta: { color: cores.textoSuave, fontSize: 12, marginTop: 6 },
  generos: { color: cores.destaque, fontSize: 12, fontWeight: '600', marginHorizontal: espaco.m, marginTop: espaco.m },
  blocoSinopse: { marginHorizontal: espaco.m, marginTop: 10 },
  sinopse: { color: cores.textoSuave, fontSize: 14, lineHeight: 21 },
  progresso: { marginHorizontal: espaco.m, marginTop: espaco.m },
  contagem: { color: cores.texto, fontSize: 13, fontWeight: '600', marginBottom: espaco.p },
  acoes: { flexDirection: 'row', gap: espaco.p, marginTop: 12 },
  acao: { flex: 1 },
  dica: { color: cores.textoSuave, fontSize: 11, textAlign: 'center', marginTop: espaco.p },
  temporadas: { gap: espaco.p, paddingHorizontal: espaco.m, paddingTop: espaco.m },
  creditos: { color: cores.textoSuave, fontSize: 11, textAlign: 'center', padding: espaco.m },
});
