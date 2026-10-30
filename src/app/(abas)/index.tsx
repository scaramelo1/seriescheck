import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { buscarSeries, ErroLimite } from '../../api/tvmaze';
import { Aviso, Carregando, Chip } from '../../componentes/ui';
import type { Ordem } from '../../dominio/series';
import type { ResumoSerie } from '../../dominio/tipos';
import { t } from '../../i18n';
import { cores, espaco } from '../../tema';

const ORDENS: { id: Ordem; nome: string }[] = [
  { id: 'populares', nome: t.ordemPopulares },
  { id: 'em-exibicao', nome: t.ordemEmExibicao },
  { id: 'melhores', nome: t.ordemMelhores },
];

export default function Explorar() {
  const [texto, setTexto] = useState('');
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState<Ordem>('populares');
  const [series, setSeries] = useState<ResumoSerie[]>([]);
  const [pagina, setPagina] = useState(1);
  const [temMais, setTemMais] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string>();
  // Só a resposta do pedido mais recente vale; uma busca lenta não pode sobrescrever a nova.
  const pedido = useRef(0);

  // O TVmaze limita as consultas por segundo; só busca quando a digitação para.
  useEffect(() => {
    const espera = setTimeout(() => setBusca(texto), 500);
    return () => clearTimeout(espera);
  }, [texto]);

  const carregar = useCallback(
    async (numero: number) => {
      const atual = ++pedido.current;
      setCarregando(true);
      setErro(undefined);
      try {
        const res = await buscarSeries(busca, ordem, numero);
        if (atual !== pedido.current) return;
        setPagina(numero);
        setTemMais(res.temMais);
        setSeries((lista) => {
          if (numero === 1) return res.series;
          const vistos = new Set(lista.map((a) => a.id));
          return [...lista, ...res.series.filter((a) => !vistos.has(a.id))];
        });
      } catch (e) {
        if (atual !== pedido.current) return;
        setErro(e instanceof ErroLimite ? t.erroLimite : t.erroInternet);
      } finally {
        if (atual === pedido.current) setCarregando(false);
      }
    },
    [busca, ordem],
  );

  useEffect(() => {
    setSeries([]);
    setTemMais(false);
    carregar(1);
  }, [carregar]);

  const carregarMais = () => {
    if (temMais && !carregando && !erro) carregar(pagina + 1);
  };

  return (
    <View style={estilos.tela}>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder={t.buscarPlaceholder}
        placeholderTextColor={cores.textoSuave}
        style={estilos.busca}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      {!busca.trim() && (
        <View style={estilos.chips}>
          {ORDENS.map((o) => (
            <Chip key={o.id} texto={o.nome} ativo={ordem === o.id} aoTocar={() => setOrdem(o.id)} />
          ))}
        </View>
      )}
      <FlatList
        data={series}
        keyExtractor={(a) => String(a.id)}
        numColumns={3}
        columnWrapperStyle={estilos.coluna}
        contentContainerStyle={estilos.lista}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <CartaoSerie serie={item} />}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.6}
        ListEmptyComponent={
          carregando ? (
            <Carregando />
          ) : erro ? (
            <Aviso texto={erro} acao={t.tentarDeNovo} aoTocar={() => carregar(1)} />
          ) : (
            <Aviso texto={t.nenhumaSerie} />
          )
        }
        ListFooterComponent={
          series.length > 0 && erro ? (
            <Aviso texto={erro} acao={t.tentarDeNovo} aoTocar={() => carregar(pagina + 1)} />
          ) : series.length > 0 && carregando ? (
            <ActivityIndicator color={cores.destaque} style={{ margin: espaco.m }} />
          ) : undefined
        }
      />
    </View>
  );
}

function CartaoSerie({ serie }: { serie: ResumoSerie }) {
  return (
    <Pressable
      style={estilos.cartao}
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/serie/[id]', params: { id: String(serie.id) } })}
    >
      <Image
        source={serie.capa}
        recyclingKey={String(serie.id)}
        style={estilos.capa}
        contentFit="cover"
        transition={150}
      />
      <Text style={estilos.titulo} numberOfLines={2}>
        {serie.titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  busca: {
    backgroundColor: cores.cartao,
    color: cores.texto,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    margin: espaco.m,
    marginBottom: 10,
    fontSize: 15,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.p, paddingHorizontal: espaco.m, marginBottom: 10 },
  lista: { paddingHorizontal: espaco.m, paddingBottom: espaco.g, flexGrow: 1 },
  coluna: { gap: 10 },
  cartao: { flex: 1 / 3, marginBottom: 14 },
  capa: { width: '100%', aspectRatio: 0.7, borderRadius: 10, backgroundColor: cores.cartao },
  titulo: { color: cores.texto, fontSize: 12, fontWeight: '600', marginTop: 6 },
});
