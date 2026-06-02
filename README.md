# Copa Replay

Copa Replay e um app gamificado para testar memoria futebolistica em partidas historicas das Copas do Mundo. O usuario escolhe um modo de jogo, faz uma rodada de palpites, ganha pontos, acompanha o historico e tambem pode salvar palpites para a Copa 2026.

## Experiencia do app

Fluxo principal:

```text
Home -> Desafio Historico -> Rodada -> Resumo -> Historico
```

Areas secundarias:

- Palpites Copa 2026
- Explorar Copas
- Times/Selecoes
- Perfil
- Gerenciamento de jogos da Copa 2026

## Desafio Historico

O Desafio Historico usa jogos reais importados do OpenFootball World Cup JSON.

Modos disponiveis:

- Rodada rapida: sorteia ate 5 partidas historicas aleatorias.
- Escolher Copa: o usuario escolhe uma edicao e joga apenas com partidas daquela Copa.
- Jogar com esta partida: no detalhe de um jogo historico, o usuario pode jogar uma rodada de uma partida.

Sistema de pontos:

- Placar exato: 3 pontos
- Acertou vencedor ou empate: 1 ponto
- Errou resultado: 0 pontos

Cada rodada mostra:

- partida atual
- placar escondido antes do palpite
- resultado real apos confirmar
- pontos da partida
- resumo final com pontuacao total, placares exatos, acertos de vencedor e erros

## Historico e desempenho

O app calcula estatisticas a partir dos palpites salvos:

- pontuacao total
- tentativas totais
- placares exatos
- acertos de vencedor
- erros
- taxa de acerto

Esses dados aparecem na Home, no Historico e no Perfil.

## Palpites Copa 2026

A area "Palpites Copa 2026" usa jogos vindos da API externa `worldcup26.ir`.

Ao abrir a tela, o app:

1. atualiza os jogos automaticamente pelo backend;
2. carrega a lista local salva no PostgreSQL;
3. permite pesquisar por selecao;
4. mostra jogos encontrados;
5. permite adicionar palpites pessoais;
6. lista os palpites 2026 do usuario logado.

Os palpites da Copa 2026 sao separados dos palpites historicos para nao misturar o jogo principal com a area de jogos futuros.

## Perfil

O Perfil permite:

- ver dados do usuario;
- ver pontuacao total;
- editar nome;
- alterar senha em rota separada;
- sair da conta;
- acessar areas extras.

## Tecnologias

Mobile:

- Expo SDK 54
- React Native
- TypeScript
- Expo Router
- Zustand
- Axios
- AsyncStorage

Back-end:

- Java 17+
- Spring Boot 3
- Maven
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- PostgreSQL
- Lombok
- Bean Validation
- Docker

## Como rodar localmente

Suba o PostgreSQL:

```bash
docker compose up -d
```

Rode a API:

```bash
mvn spring-boot:run
```

A API fica em:

```text
http://localhost:8080
```

Health check:

```text
http://localhost:8080/health
```

Rode o app mobile:

```bash
cd copa-replay-mobile
npm install
npm run web
```

Ou:

```bash
npm start
```

## Configurar API no mobile

Arquivo:

```text
copa-replay-mobile/src/config/api.ts
```

Local no PC:

```ts
export const API_BASE_URL = "http://localhost:8080";
```

Para celular fisico na mesma rede, troque `localhost` pelo IP da maquina.

## Banco PostgreSQL local

Configuracao padrao:

```text
database: copa_replay
user: postgres
password: postgres
host: localhost
port: 5433 no host local, mapeando para 5432 dentro do container
```

O projeto usa:

```text
spring.jpa.hibernate.ddl-auto=update
```

## Variaveis de ambiente

```text
DATABASE_URL=jdbc:postgresql://localhost:5433/copa_replay
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=troque-por-um-segredo-forte
JWT_EXPIRATION=86400000
OPENFOOTBALL_BASE_URL=https://raw.githubusercontent.com/openfootball/worldcup.json/master
WORLDCUP_2026_BASE_URL=https://worldcup26.ir
PORT=8080
```

## Endpoints principais

Auth:

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

Usuario:

- `PUT /api/users/me`
- `PUT /api/users/me/password`

Copas:

- `GET /api/world-cups`
- `GET /api/world-cups/{id}/matches`

Jogos historicos:

- `GET /api/matches`
- `GET /api/matches/{id}`

Palpites historicos:

- `GET /api/predictions`
- `GET /api/predictions/{id}`
- `POST /api/predictions`
- `DELETE /api/predictions/{id}`

Times:

- `GET /api/teams`
- `GET /api/teams/{id}`

Jogos/Resultados Copa 2026:

- `GET /api/world-cup-2026-results`
- `POST /api/world-cup-2026-results/import-fixtures`
- `POST /api/world-cup-2026-results`
- `GET /api/world-cup-2026-results/{id}`
- `PUT /api/world-cup-2026-results/{id}`
- `DELETE /api/world-cup-2026-results/{id}`

Palpites Copa 2026:

- `GET /api/world-cup-2026-predictions`
- `GET /api/world-cup-2026-predictions/{id}`
- `POST /api/world-cup-2026-predictions`
- `PUT /api/world-cup-2026-predictions/{id}`
- `DELETE /api/world-cup-2026-predictions/{id}`

## Exemplos de payload

Criar palpite historico:

```json
{
  "matchId": 1,
  "predictedHomeScore": 2,
  "predictedAwayScore": 1
}
```

Criar palpite Copa 2026:

```json
{
  "worldCup2026ResultId": 1,
  "predictedHomeScore": 2,
  "predictedAwayScore": 1
}
```

Editar perfil:

```json
{
  "name": "Novo nome"
}
```

Alterar senha:

```json
{
  "currentPassword": "senhaAtual",
  "newPassword": "novaSenha"
}
```

## Importacao de dados

Dados historicos:

- OpenFootball World Cup JSON
- importacao de Copas, selecoes e jogos para PostgreSQL
- suporte atual para 2014, 2018 e 2022

Dados Copa 2026:

- `https://worldcup26.ir/get/games`
- `https://worldcup26.ir/get/stadiums`
- importacao idempotente usando `sourceMatchId`

## Deploy no Render

O projeto tem um Blueprint em `render.yaml` para criar:

- `copa-replay-api`: Web Service Docker
- `copa-replay-db`: PostgreSQL

Passos:

1. Faça commit e push do repositório para GitHub/GitLab/Bitbucket.
2. No Render, abra `Blueprints` e crie um novo Blueprint usando este repositório.
3. Confirme a criação do banco e do serviço.
4. Aguarde o deploy terminar.
5. Teste a API em:

```text
https://URL_DO_SERVICO_RENDER/health
```

Resposta esperada:

```json
{
  "status": "OK"
}
```

Depois do backend estar online, atualize o mobile em:

```text
copa-replay-mobile/src/config/api.ts
```

Exemplo:

```ts
export const API_BASE_URL = "https://URL_DO_SERVICO_RENDER";
```

## Integrantes

- LEONARDO CHAVES DA PAZ 
- NATHAN MANSUR TENÓRIO DE VASCONCELOS
