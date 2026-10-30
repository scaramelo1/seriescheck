import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { BarraProgresso, Aviso, Carregando, Chip } from '../../componentes/ui';
import { listarMinhaLista, type SerieNaLista } from '../../db/repositorio';
import { calcularProgresso } from '../../dominio/episodios';
import { t } from '../../i18n';
import { cores, espaco } from '../../tema';

type Filtro = 'todos' | 'assistindo' | 'concluidos';

const concluido = (item: SerieNaLista) => item.serie.status === 'Ended' && item.assistidos >= item.total;

export default function MinhaLista() {
  const db = useSQLiteContext();
  const [itens, setItens] = useState<SerieNaLista[]>();
  const [filtro, setFiltro] = useState<Filtro>('todos');

  useFocusEffect(
    useCallback(() => {
      listarMinhaLista(db).then(setItens);
    }, [db]),
  );

  if (!itens) return <Carregando />;
  if (itens.length === 0) {
    return (
      <Aviso
        texto={t.listaVazia}
        acao={t.explorarSeries}
        aoTocar={() => router.navigate('/')}
      />
    );
  }

  const visiveis = itens.filter((i) => filtro === 'todos' || (filtro === 'concluidos') === concluido(i));

  return (
    <View style={estilos.tela}>
      <View style={estilos.chips}>
        <Chip texto={t.todos(itens.length)} ativo={filtro === 'todos'} aoTocar={() => setFiltro('todos')} />
        <Chip texto={t.assistindo} ativo={filtro === 'assistindo'} aoTocar={() => setFiltro('assistindo')} />
        <Chip texto={t.concluidos} ativo={filtro === 'concluidos'} aoTocar={() => setFiltro('concluidos')} />
      </View>
      <FlatList
        data={visiveis}
        keyExtractor={(i) => String(i.serie.id)}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => <LinhaLista item={item} />}
        ListEmptyComponent={<Aviso texto={t.nadaNoFiltro} />}
      />
    </View>
  );
}

function LinhaLista({ item }: { item: SerieNaLista }) {
  const progresso = calcularProgresso(item.assistidos, item.total);
  return (
    <Pressable
      style={estilos.linha}
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/serie/[id]', params: { id: String(item.serie.id) } })}
    >
      <Image source={item.serie.capa} style={estilos.capa} contentFit="cover" />
      <View style={estilos.corpo}>
        <Text style={estilos.titulo} numberOfLines={2}>
          {item.serie.titulo}
        </Text>
        <Text style={estilos.contagem}>
          {t.deEpisodios(item.assistidos, item.total)}
        </Text>
        <BarraProgresso percentual={progresso.percentual} />
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.p, padding: espaco.m },
  lista: { paddingHorizontal: espaco.m, paddingBottom: espaco.g, flexGrow: 1 },
  linha: {
    flexDirection: 'row',
    backgroundColor: cores.cartao,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  capa: { width: 62, height: 88, borderRadius: 8, backgroundColor: cores.borda },
  corpo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  titulo: { color: cores.texto, fontSize: 15, fontWeight: '600' },
  contagem: { color: cores.textoSuave, fontSize: 12, marginVertical: 6 },
});
