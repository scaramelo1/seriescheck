# SeriesCheck

App Android/iOS (Expo) para explorar séries e marcar cada episódio assistido.

- **Explorar**: busca e listas (populares, em exibição, melhores notas) com rolagem infinita.
- **Série**: capa, sinopse, progresso e episódios por temporada, com imagem e resumo. Toque no
  círculo para marcar; segure para marcar até aquele episódio, contando as temporadas anteriores.
- **Minha lista**: séries com progresso, filtradas por assistindo e concluídas.

## Dados

- [TVmaze](https://www.tvmaze.com/api) (sem chave, CC BY-SA, 20 consultas a cada 10 segundos):
  busca, detalhes e episódios.
- `src/dados/catalogo.json`: as 1.500 séries mais populares. O TVmaze não ordena por popularidade
  nem por nota, então as listas de Explorar vêm desse arquivo. Atualize com `npm run catalogo`.
- [MyMemory](https://mymemory.translated.net/doc/spec.php) (sem chave, cerca de 5.000 caracteres
  por dia): tradução automática de sinopses e resumos, que vêm em inglês.

O idioma segue o do celular: telas em português, inglês e espanhol (outros caem no inglês), sinopses
e resumos por tradução automática, salva no aparelho. Títulos de episódio ficam em inglês.

Os ticks ficam só no aparelho (expo-sqlite). Episódios abertos ficam em cache para uso offline.

## Rodar

```bash
npm install
npx expo install --fix
npx expo start
```

`npm test` roda os testes do domínio e não precisa de `node_modules`.
APK: `npx eas-cli@latest build --profile preview --platform android`.
