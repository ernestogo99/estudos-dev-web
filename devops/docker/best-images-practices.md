# Boas práticas com imagens Docker

Quando falamos em imagens Docker, o tamanho importa muito mais do que parece. Uma imagem grande pode aumentar:

- o custo de armazenamento e transferência
- o tempo de build e deploy
- o consumo de largura de banda e rede
- o tempo de inicialização dos containers
- a superfície de ataque, porque mais arquivos significam mais vulnerabilidades potenciais

Em outras palavras, uma imagem "mais leve" costuma ser mais eficiente, segura e fácil de operar.

---

## 1) Escolha da imagem base

A imagem base é o ponto de partida. Se você usa uma base muito grande, toda a sua aplicação herda esse peso.

Exemplo ruim:

```dockerfile
FROM node:22

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview"]
```

Neste caso, a imagem base `node:22` é relativamente grande, porque utiliza uma distribuição completa e traz vários pacotes que podem não ser necessários para executar a aplicação em produção.

Se trocar para uma base menor:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview"]
```

A imagem base diminui bastante, e isso já reduz o tamanho final.

Em geral, `alpine` ou `slim` ajudam a deixar a imagem muito menor quando comparadas com uma versão padrão.

> **Observação:** `alpine` é uma distribuição muito leve, mas pode ter incompatibilidades com bibliotecas que esperam `glibc`. Já `slim` normalmente é uma variação mais enxuta do Debian, mantendo uma compatibilidade maior com aplicações que dependem desse ecossistema.

---

## 2) Camadas de cache

O Docker usa cache por camadas. Isso significa que quando uma instrução do Dockerfile não muda, ele pode reaproveitar o resultado da camada anterior para acelerar o build.

Se você fizer isso:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview"]
```

A camada `RUN npm install` pode permanecer em cache enquanto o conteúdo de `package*.json` não mudar.

Isso é útil porque, ao alterar apenas o código da aplicação, o Docker não precisa reinstalar todas as dependências novamente.

### O que invalida o cache?

- alteração em algum arquivo copiado
- alteração em alguma instrução do Dockerfile
- alteração em uma camada anterior, porque a ordem das instruções importa

A ordem importa porque o Docker monta a imagem em sequência. Se você muda uma camada anterior, todas as que vierem depois podem precisar ser reconstruídas.

### Regra prática

Copie primeiro os arquivos que definem as dependências e instale antes de copiar o restante do código.

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
```

Isso deixa o processo muito mais eficiente.

---

## 3) Remoção de arquivos desnecessários

Um dos motivos para uma imagem ficar pesada é o acúmulo de arquivos que não são usados em produção:

- `node_modules` local
- arquivos de build
- `.git`
- configurações de IDE
- logs
- arquivos temporários
- arquivos de testes
- arquivos de ambiente

Para evitar que esses arquivos sejam enviados para o contexto de build, use um arquivo `.dockerignore`:

```dockerignore
# Node
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build
dist
build
coverage

# Controle de versão
.git
.gitignore

# IDE e editor
.vscode
.idea
*.swp
*.swo

# Variáveis de ambiente
.env
.env.local
.env.*
!.env.example

# Sistema
.DS_Store
Thumbs.db
```

Isso evita que arquivos desnecessários entrem no contexto enviado ao Docker durante o build.

> **Importante:** `.dockerignore` não remove arquivos de uma imagem já construída. Ele impede que determinados arquivos sejam enviados para o contexto de build.

---

## 4) Entendendo as camadas da imagem

O Docker trabalha com camadas imutáveis. Cada instrução relevante do Dockerfile contribui para a construção da imagem, e o Docker armazena essas mudanças em camadas.

### Pontos importantes

- cada camada é imutável
- uma camada depende das anteriores
- instruções `RUN` podem criar novas camadas
- apagar um arquivo em uma camada posterior não necessariamente remove os dados armazenados nas camadas anteriores
- arquivos grandes adicionados e posteriormente removidos podem continuar aumentando o tamanho da imagem

Por exemplo:

```dockerfile
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*
```

Uma abordagem melhor é fazer a instalação e a limpeza na mesma instrução:

```dockerfile
RUN apt-get update \
    && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*
```

Dessa forma, os arquivos temporários podem ser removidos dentro do processo que cria a camada.

> **Importante:** não é necessário transformar o Dockerfile em uma única camada. O objetivo é evitar camadas que armazenem artefatos desnecessários.

---

## 5) Multi-stage builds

Um dos melhores recursos para manter a imagem pequena é o multi-stage build.

Ele funciona assim:

1. uma etapa é utilizada para instalar dependências e compilar a aplicação
2. uma segunda etapa contém apenas o necessário para executar a aplicação

Exemplo para uma aplicação frontend:

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Aqui:

- `builder` possui Node.js e todas as ferramentas necessárias para o build
- `nginx:alpine` é utilizado apenas como runtime
- `node_modules` não entra na imagem final
- ferramentas de desenvolvimento não entram na imagem final
- apenas o conteúdo de `dist` é copiado para a imagem de produção

Essa abordagem reduz bastante o tamanho final e também diminui a superfície de ataque.

---

## 6) O que é `slim` e como usar

A tag `slim` representa uma variante reduzida de uma imagem oficial.

Exemplos:

```dockerfile
FROM node:22-slim
```

```dockerfile
FROM python:3.12-slim
```

```dockerfile
FROM debian:bookworm-slim
```

A variante `slim` possui menos pacotes e ferramentas do que a imagem padrão.

### Quando usar?

Use `slim` quando:

- você quer uma imagem menor
- precisa de boa compatibilidade com o ecossistema Debian
- não precisa das ferramentas presentes na imagem completa

### Comparação simplificada

| Base             |       Tamanho | Compatibilidade | Uso                               |
| ---------------- | ------------: | --------------- | --------------------------------- |
| `node:22`        |         maior | alta            | desenvolvimento / compatibilidade |
| `node:22-slim`   |         menor | alta            | produção                          |
| `node:22-alpine` |   muito menor | pode variar     | produção quando compatível        |
| Distroless       | muito pequena | específica      | runtime altamente enxuto          |

> `slim` não significa que a imagem será automaticamente pequena. O tamanho final também depende das dependências e arquivos da aplicação.

---

# 7) Slim Toolkit

Depois de otimizar manualmente o Dockerfile, podemos utilizar uma ferramenta para reduzir ainda mais a imagem.

Uma dessas ferramentas é o **Slim Toolkit**, anteriormente conhecido pelo comando `docker-slim`.

O Slim Toolkit analisa a imagem e observa o comportamento da aplicação em execução para identificar quais arquivos e recursos realmente são utilizados. Depois, ele pode gerar uma nova imagem contendo apenas os componentes necessários para aquele comportamento observado.

A ideia é:

```text
Dockerfile
    ↓
docker build
    ↓
Imagem original
    ↓
Slim Toolkit
    ↓
Análise da aplicação
    ↓
Imagem otimizada
```

### 7.1) Instalação

Uma das formas de utilizar o Slim Toolkit é instalar o executável `docker-slim`.

Também existe a opção de executar a ferramenta através de uma imagem Docker. O projeto disponibiliza a imagem `dslim/docker-slim`.

Para verificar uma instalação existente:

```bash
docker-slim --version
```

Também podemos consultar a ajuda:

```bash
docker-slim help
```

E especificamente a ajuda do comando `build`:

```bash
docker-slim build --help
```

---

## 7.2) Primeiro, construa sua imagem normalmente

O Slim Toolkit não substitui o `docker build`.

Primeiro criamos uma imagem Docker funcional:

```bash
docker build -t minha-api:original .
```

Podemos verificar o tamanho:

```bash
docker images minha-api
```

Ou:

```bash
docker image ls
```

Exemplo:

```text
REPOSITORY   TAG        IMAGE ID       SIZE
minha-api    original   abc123         450MB
```

Esse será nosso ponto de comparação.

---

## 7.3) Teste a imagem original

Antes de utilizar o Slim Toolkit, devemos garantir que a imagem original funciona corretamente.

Por exemplo:

```bash
docker run -d \
  --name minha-api \
  -p 8080:8080 \
  minha-api:original
```

Depois verificamos:

```bash
docker ps
```

E podemos testar a aplicação:

```bash
curl http://localhost:8080
```

Para uma API REST, devemos testar também endpoints importantes:

```bash
curl http://localhost:8080/api/users
```

A ideia é importante:

> **Primeiro faça a aplicação funcionar. Depois faça a otimização.**

---

## 7.4) Executando o Slim Toolkit

O comando principal é:

```bash
docker-slim build minha-api:original
```

O Slim Toolkit analisa a imagem e cria uma versão otimizada.

Normalmente, a nova imagem recebe o sufixo:

```text
.slim
```

Então podemos ter:

```text
minha-api:original
minha-api.slim
```

O projeto utiliza esse padrão nos exemplos oficiais.

---

## 7.5) Utilizando HTTP Probe

Para aplicações HTTP, podemos utilizar:

```bash
docker-slim build --http-probe minha-api:original
```

O `--http-probe` permite que o Slim Toolkit faça requisições HTTP para a aplicação durante o processo de análise.

Isso é importante porque a ferramenta precisa observar quais partes da aplicação são utilizadas.

Por exemplo:

```text
Aplicação
   │
   ├── /health
   ├── /users
   ├── /products
   └── /reports
```

Se durante a análise somente `/health` e `/users` forem acessados, alguns recursos utilizados exclusivamente por `/reports` podem não ser identificados.

Por isso, **a qualidade dos testes realizados durante a análise influencia diretamente o resultado da otimização**.

---

## 7.6) Teste a imagem otimizada

Depois que o Slim Toolkit terminar:

```bash
docker images
```

Podemos encontrar algo semelhante a:

```text
REPOSITORY   TAG        SIZE
minha-api    original   450MB
minha-api    slim       80MB
```

Agora execute a imagem otimizada:

```bash
docker run -d \
  --name minha-api-slim \
  -p 8080:8080 \
  minha-api.slim
```

E teste novamente:

```bash
curl http://localhost:8080
```

Devemos testar os mesmos endpoints utilizados na aplicação original.

---

## 7.7) Comparando os tamanhos

Podemos verificar diretamente:

```bash
docker image ls minha-api
```

Exemplo:

```text
REPOSITORY   TAG        SIZE
minha-api    original   450MB
minha-api    slim       80MB
```

Podemos calcular a redução:

```text
Redução = ((450 - 80) / 450) × 100

Redução ≈ 82%
```

Nesse exemplo hipotético, a imagem foi reduzida em aproximadamente 82%.

> **Importante:** o resultado varia muito de acordo com a aplicação. Não devemos assumir uma redução específica antes de medir.

---

# 8) `xray`: descobrir por que a imagem é grande

Além de gerar uma imagem otimizada, o Slim Toolkit possui o comando `xray`.

```bash
docker-slim xray minha-api:original
```

O `xray` realiza uma análise estática da imagem e pode ajudar a entender o que existe dentro dela e quais componentes contribuem para o tamanho.

Isso é especialmente útil antes de tentar otimizar.

Podemos pensar no fluxo:

```text
xray
  ↓
Entender a imagem
  ↓
Identificar componentes desnecessários
  ↓
Melhorar Dockerfile
  ↓
docker build
  ↓
Slim Toolkit
```

Ou seja, o Slim Toolkit não precisa ser utilizado apenas como um "compressor de imagem". Ele também pode ser utilizado para entender melhor o conteúdo da imagem.

---

# 9) `profile`: analisar sem necessariamente gerar uma imagem otimizada

Outro comando importante é:

```bash
docker-slim profile minha-api:original
```

O `profile` realiza análise da imagem e da execução da aplicação, mas não tem como objetivo principal gerar uma nova imagem otimizada.

Isso pode ser útil para descobrir quais recursos a aplicação utiliza antes de aplicar uma otimização.

Podemos pensar:

```text
profile
   ↓
descobrir comportamento

build
   ↓
otimizar imagem
```

---

# 10) O grande cuidado: análise dinâmica

O Slim Toolkit utiliza análise do comportamento da aplicação.

Isso gera uma consequência importante:

> **Se um recurso não for utilizado durante a análise, ele pode não ser incluído na imagem otimizada.**

Imagine uma API:

```text
GET /users
GET /products
GET /reports
POST /login
POST /upload
```

Se durante a análise testarmos apenas:

```text
GET /users
GET /products
```

a ferramenta pode não descobrir tudo que é necessário para:

```text
GET /reports
POST /login
POST /upload
```

Por isso, não devemos executar simplesmente:

```bash
docker-slim build minha-api:original
```

e imediatamente colocar a imagem gerada em produção.

Primeiro devemos testar a aplicação de forma abrangente.

---

# 11) Estratégia recomendada para uma API

Para uma API REST, podemos utilizar o seguinte fluxo:

```text
1. Construir imagem
        ↓
2. Executar imagem original
        ↓
3. Testar endpoints
        ↓
4. Executar Slim Toolkit
        ↓
5. Gerar imagem otimizada
        ↓
6. Executar imagem otimizada
        ↓
7. Rodar testes novamente
        ↓
8. Comparar tamanho
        ↓
9. Validar comportamento
        ↓
10. Publicar
```

Por exemplo:

```bash
docker build -t minha-api:original .
```

Depois:

```bash
docker run -d \
  --name minha-api-original \
  -p 8080:8080 \
  minha-api:original
```

Executamos os testes:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/users
curl http://localhost:8080/api/products
```

Depois:

```bash
docker-slim build --http-probe minha-api:original
```

E finalmente:

```bash
docker run -d \
  --name minha-api-slim \
  -p 8081:8080 \
  minha-api:original.slim
```

Então repetimos os testes:

```bash
curl http://localhost:8081/health
curl http://localhost:8081/api/users
curl http://localhost:8081/api/products
```

---

# 12) Slim Toolkit não substitui Multi-stage Build

É importante entender a diferença.

### Multi-stage build

É uma técnica utilizada durante a construção da imagem:

```text
Código
  ↓
Builder
  ↓
Build
  ↓
Runtime
```

Exemplo:

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
```

### Slim Toolkit

É uma etapa posterior:

```text
Dockerfile otimizado
        ↓
docker build
        ↓
Imagem funcional
        ↓
Slim Toolkit
        ↓
Imagem ainda mais enxuta
```

Portanto, podemos utilizar os dois:

```text
Multi-stage
     +
.dockerignore
     +
base slim/alpine
     +
Slim Toolkit
```

Eles são complementares.

---

# 13) Segurança

Uma imagem menor também pode ter uma superfície de ataque menor.

Imagine uma imagem contendo:

```text
Node.js
npm
curl
git
vim
compiladores
documentação
ferramentas de debug
bibliotecas extras
```

Se a aplicação precisa apenas de:

```text
Node.js
bibliotecas da aplicação
arquivos da aplicação
```

todo o restante aumenta o número de componentes presentes no container.

O Slim Toolkit pode ajudar a remover componentes que não são necessários para o comportamento observado da aplicação. O projeto também possui recursos relacionados à geração de perfis de segurança, como Seccomp.

> **Importante:** imagem menor não significa automaticamente imagem segura. Ainda devemos utilizar scanners de vulnerabilidade, atualizar dependências, executar como usuário não-root quando possível e seguir boas práticas de segurança.

---

# 14) Fluxo completo recomendado

Uma estratégia madura para otimização de imagens Docker pode ser:

```text
                    Dockerfile
                        │
                        ▼
                ┌───────────────┐
                │ .dockerignore │
                └───────┬───────┘
                        │
                        ▼
                 Imagem base
              slim / alpine etc.
                        │
                        ▼
                 Multi-stage
                        │
                        ▼
                docker build
                        │
                        ▼
              Imagem funcional
                        │
                        ▼
              Slim Toolkit
                        │
                        ▼
              Imagem otimizada
                        │
                        ▼
             Testes automatizados
                        │
                        ▼
                 Scanner de
                vulnerabilidades
                        │
                        ▼
                   Registry
                        │
                        ▼
                  Produção
```

---

# 15) Exemplo final completo

Uma abordagem para uma aplicação Node.js poderia começar assim:

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 4173

CMD ["node", "dist/server.js"]
```

Depois:

```bash
docker build -t minha-api:original .
```

Testamos:

```bash
docker run -d \
  --name minha-api \
  -p 4173:4173 \
  minha-api:original
```

Depois executamos:

```bash
docker-slim build --http-probe minha-api:original
```

E testamos a imagem gerada:

```bash
docker run -d \
  --name minha-api-slim \
  -p 4174:4173 \
  minha-api:original.slim
```

Finalmente:

```bash
docker images minha-api
```

E comparamos:

```text
imagem original
        VS
imagem otimizada
```

---

# 16) Checklist de otimização

Antes de publicar uma imagem Docker, podemos verificar:

- [ ] Utilizei uma imagem base adequada?
- [ ] Posso utilizar `slim` ou `alpine`?
- [ ] Possuo um `.dockerignore`?
- [ ] Estou aproveitando o cache do Docker?
- [ ] Dependências de desenvolvimento estão fora da imagem final?
- [ ] Estou utilizando multi-stage build?
- [ ] Arquivos temporários estão sendo removidos?
- [ ] A imagem contém somente o necessário para execução?
- [ ] Testei a imagem original?
- [ ] Analisei a imagem com Slim Toolkit?
- [ ] Testei todos os endpoints/fluxos importantes depois do Slim Toolkit?
- [ ] Comparei o tamanho antes e depois?
- [ ] Executei um scanner de vulnerabilidades?
- [ ] A aplicação continua funcionando depois da otimização?

---

# 17) Resumo prático

Para reduzir o tamanho de uma imagem Docker:

1. prefira imagens base menores (`alpine`, `slim` ou Distroless quando apropriado)
2. organize o Dockerfile para aproveitar o cache
3. utilize `.dockerignore`
4. evite armazenar arquivos temporários nas camadas
5. utilize multi-stage builds
6. não instale dependências de desenvolvimento na imagem final
7. analise o conteúdo da imagem com ferramentas como `docker-slim xray`
8. utilize `docker-slim build` para gerar uma imagem otimizada
9. utilize `--http-probe` e testes representativos para aplicações HTTP
10. teste profundamente a imagem otimizada antes de colocá-la em produção
11. compare o tamanho antes e depois
12. utilize scanners de vulnerabilidades como parte do pipeline

---

# Conclusão

O tamanho da imagem Docker deve ser tratado como parte do design da aplicação.

Pequenas decisões, como trocar a imagem base, utilizar `.dockerignore`, organizar corretamente as camadas e adotar multi-stage builds, podem reduzir significativamente o tamanho final.

O **Slim Toolkit** pode ser utilizado como uma etapa adicional de otimização. Ele analisa a aplicação em execução e tenta remover componentes que não são necessários para o comportamento observado.

A estratégia ideal não é simplesmente:

```text
"usar Slim Toolkit"
```

mas sim:

```text
Dockerfile bem estruturado
        +
imagem base adequada
        +
.dockerignore
        +
multi-stage build
        +
Slim Toolkit
        +
testes
        +
scanner de segurança
```

Dessa forma, conseguimos produzir imagens menores, mais rápidas para distribuir, com menor superfície de ataque e mais adequadas para ambientes de produção.
