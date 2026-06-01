# Copa Replay Mobile

Aplicativo mobile em React Native + Expo para explorar Copas do Mundo historicas e jogar o modo **Desafio Historico**, conectado ao back-end Spring Boot do Copa Replay.

## Tecnologias

- Expo SDK 54
- React Native
- TypeScript
- Expo Router
- Zustand
- Axios
- AsyncStorage
- StyleSheet

## Instalar dependencias

```bash
cd copa-replay-mobile
npm install
```

## Configurar API

Edite `src/config/api.ts`:

```ts
export const API_BASE_URL = "http://SEU_IP_LOCAL:8080";
```

No celular fisico, nao use `localhost`. Use o IP da maquina que esta rodando o back-end Spring Boot na mesma rede Wi-Fi.

Exemplo:

```ts
export const API_BASE_URL = "http://192.168.0.15:8080";
```

## Rodar o app

```bash
npx expo start
```

Abra no Expo Go ou em um emulador Android/iOS.

Para testar no navegador:

```bash
npx expo start -c
```

Depois pressione `w`.

## Login e cadastro

O app usa os endpoints:

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

O token JWT e o usuario sao persistidos no AsyncStorage e enviados automaticamente pelo interceptor Axios.

## Desafio Historico

O fluxo principal do app e o modo game:

1. O usuario entra em `Desafio Historico`.
2. O app busca jogos reais em `GET /api/matches`.
3. Uma partida historica e sorteada no front.
4. O placar real fica escondido.
5. O usuario informa o placar previsto.
6. O app salva a tentativa em `POST /api/predictions`.
7. O resultado real e revelado.
8. A pontuacao e calculada no front.

Sistema de pontos:

- `+3` pontos: acertou o placar exato.
- `+1` ponto: acertou vencedor ou empate.
- `+0` pontos: errou o resultado.

## CRUD de Palpites/Tentativas

- Criar tentativa jogando uma rodada no Desafio Historico.
- Listar tentativas em `Historico`.
- Ver detalhes em `app/palpites/[id].tsx`.
- Editar apenas a observacao/nome da tentativa.
- Excluir tentativa com confirmacao.

O placar da tentativa nao e editado na interface principal para preservar a logica do jogo.

## Perfil

A tela Perfil permite:

- Ver nome, email e pontuacao total.
- Editar nome via `PUT /api/users/me`.
- Alterar senha via `PUT /api/users/me/password`.
- Fazer logout.
- Acessar Sobre, Equipe e Selecoes.

## Telas do app

- Home
- Sobre
- Login
- Cadastro
- Copas
- Jogos da Copa
- Detalhes do Jogo
- Desafio Historico
- Historico de Tentativas
- Detalhes/Editar Tentativa
- Perfil
- Selecoes
- Resultados 2026
- Equipe
- Perfil dos integrantes

## Resultados 2026

A area `Resultados 2026` e um CRUD separado para placares manuais da Copa 2026:

- `GET /api/world-cup-2026-results`
- `POST /api/world-cup-2026-results`
- `PUT /api/world-cup-2026-results/{id}`
- `DELETE /api/world-cup-2026-results/{id}`

As leituras sao publicas. Para criar, editar ou excluir, o usuario precisa estar autenticado.

## Integrantes da equipe

- Leonardo Chaves
- Integrante 2
- Integrante 3

Os dados de Integrante 2 e Integrante 3 sao ficticios e ficam faceis de editar nas telas dentro de `app/equipe`.
