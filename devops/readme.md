# GitLab CI/CD

CI/CD é um conjunto de práticas utilizadas para **automatizar a integração, validação, construção, entrega e implantação de software**.

O objetivo é reduzir processos manuais, detectar problemas mais cedo e tornar o processo de entrega de novas versões mais rápido, seguro e previsível.

As siglas representam:

- **CI — Continuous Integration (Integração Contínua)**
- **CD — Continuous Delivery (Entrega Contínua)**
- **CD — Continuous Deployment (Implantação Contínua)**

Uma representação simplificada:

```text
Developer
    │
    │ git push
    ▼
 GitLab Repository
    │
    ▼
 GitLab CI/CD
    │
    ▼
 Pipeline
    │
    ├── Test
    ├── Build
    ├── Security
    └── Deploy
           │
           ▼
       Ambiente
```

---

## CI — Continuous Integration

**Continuous Integration (CI)** é a prática de integrar frequentemente as alterações de código ao repositório compartilhado e executar automaticamente uma série de verificações.

Sempre que uma alteração é enviada para o GitLab, podemos configurar uma pipeline para:

- instalar dependências;
- executar lint;
- executar testes unitários;
- executar testes de integração;
- verificar qualidade do código;
- realizar verificações de segurança;
- realizar o build da aplicação.

Um fluxo comum seria:

```text
git push
   ↓
Install dependencies
   ↓
Lint
   ↓
Unit tests
   ↓
Integration tests
   ↓
Build
```

Caso alguma etapa falhe, a pipeline é interrompida ou marcada como **failed**, permitindo identificar o problema antes que a alteração seja integrada ou implantada.

```text
Push
 ↓
Install dependencies ✅
 ↓
Lint ✅
 ↓
Unit tests ❌
 ↓
Pipeline FAILED
```

Isso ajuda a evitar que código com problemas avance para as próximas etapas do processo.

---

## Configuração da CI no GitLab

No GitLab, a pipeline é normalmente definida através do arquivo:

```text
.gitlab-ci.yml
```

Esse arquivo deve estar na raiz do projeto.

Um exemplo simples:

```yaml
stages:
  - test
  - build

test:
  stage: test
  script:
    - npm ci
    - npm run lint
    - npm test

build:
  stage: build
  script:
    - npm run build
```

Nesse exemplo temos duas etapas:

```text
Pipeline
   │
   ├── test
   │    ├── npm ci
   │    ├── npm run lint
   │    └── npm test
   │
   └── build
        └── npm run build
```

A execução do `build` ocorre depois que o estágio `test` for concluído com sucesso.

---

# Arquitetura do GitLab CI/CD

Para entender o GitLab CI/CD, é importante conhecer alguns conceitos fundamentais:

```text
GitLab Repository
       │
       ▼
.gitlab-ci.yml
       │
       ▼
    Pipeline
       │
       ├───────────────┐
       ▼               ▼
    Stages            Jobs
       │               │
       │               ▼
       │            Runner
       │               │
       ▼               ▼
   Test / Build / Deploy
```

Os principais componentes são:

- **Repository**
- **`.gitlab-ci.yml`**
- **Pipeline**
- **Stage**
- **Job**
- **Runner**

---

## Repository

É o repositório onde está o código da aplicação.

Por exemplo:

```text
my-project/
├── src/
├── package.json
├── Dockerfile
└── .gitlab-ci.yml
```

Quando uma alteração é enviada para o GitLab, ela pode disparar uma pipeline de CI/CD dependendo das regras configuradas.

---

## `.gitlab-ci.yml`

O arquivo `.gitlab-ci.yml` é responsável por definir **como a pipeline deve funcionar**.

Nele podemos configurar:

- stages;
- jobs;
- comandos;
- regras de execução;
- variáveis;
- dependências entre jobs;
- artefatos;
- ambientes;
- deploys;
- condições para execução.

Exemplo:

```yaml
stages:
  - test
  - build
  - deploy
```

---

# Pipeline

Uma **pipeline** representa uma execução completa do processo de CI/CD definido no `.gitlab-ci.yml`.

Por exemplo:

```text
Pipeline #123
     │
     ├── Test
     │    ├── Lint
     │    └── Unit tests
     │
     ├── Build
     │    └── Build application
     │
     └── Deploy
          └── Deploy production
```

Uma nova pipeline pode ser criada após eventos como:

- `git push`;
- criação de Merge Request;
- execução manual;
- execução agendada;
- outros eventos configurados no GitLab.

---

# Stages

**Stage** representa uma etapa lógica da pipeline.

Por exemplo:

```yaml
stages:
  - test
  - build
  - deploy
```

A pipeline será organizada conceitualmente como:

```text
Test
 ↓
Build
 ↓
Deploy
```

Os stages ajudam a organizar o fluxo da pipeline e estabelecer uma ordem entre diferentes grupos de jobs.

---

# Jobs

**Job** é uma unidade de execução dentro de uma pipeline.

Por exemplo:

```yaml
test:
  stage: test
  script:
    - npm ci
    - npm test
```

Nesse caso:

```text
Job: test
   │
   ├── npm ci
   └── npm test
```

Podemos ter vários jobs dentro de um mesmo stage:

```yaml
stages:
  - test

lint:
  stage: test
  script:
    - npm run lint

unit_tests:
  stage: test
  script:
    - npm test
```

A estrutura seria:

```text
Pipeline
   │
   └── Test
        ├── lint
        └── unit_tests
```

Dependendo da configuração, jobs de um mesmo stage podem ser executados em paralelo.

---

# GitLab Runner

O **GitLab Runner** é o componente responsável por **executar os jobs da pipeline**.

O GitLab define o que precisa ser executado, enquanto o Runner fornece o ambiente onde os comandos serão efetivamente executados.

Podemos visualizar assim:

```text
Developer
    │
    │ git push
    ▼
 GitLab
    │
    ▼
Pipeline
    │
    ▼
 Job
    │
    │ solicita execução
    ▼
GitLab Runner
    │
    ├── npm ci
    ├── npm test
    ├── npm run build
    └── docker build
```

O Runner pode executar os comandos em diferentes tipos de ambientes, dependendo da configuração do executor.

Por exemplo:

```text
GitLab
   │
   ▼
Runner
   │
   ├── Shell
   ├── Docker
   └── Kubernetes
```

### Exemplo com Docker

Podemos configurar um Runner para executar os jobs utilizando containers Docker.

```text
GitLab
   │
   ▼
GitLab Runner
   │
   ▼
Docker
   │
   ▼
Container
   │
   ├── npm ci
   ├── npm test
   └── npm run build
```

Isso permite criar ambientes mais isolados e reproduzíveis para execução das pipelines.

---

# GitLab CI/CD — Fluxo completo

Considerando todos os componentes, podemos visualizar uma arquitetura mais completa:

```text
┌──────────────────────┐
│      Developer       │
└──────────┬───────────┘
           │
           │ git push
           ▼
┌──────────────────────┐
│   GitLab Repository  │
│                      │
│   .gitlab-ci.yml     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       Pipeline       │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐ ┌─────────┐
│  Stage  │ │  Stage  │
│  Test   │ │  Build  │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
   Jobs         Jobs
     │           │
     └─────┬─────┘
           ▼
┌──────────────────────┐
│    GitLab Runner     │
└──────────┬───────────┘
           │
           ▼
      Execution
           │
           ▼
     Build / Deploy
```

---

# CD — Continuous Delivery

**Continuous Delivery (Entrega Contínua)** é a prática de automatizar o processo de preparar o software para ser entregue.

Depois que o código passa pelas validações da CI, podemos:

1. gerar o build;
2. criar uma imagem Docker;
3. publicar a imagem em um Container Registry;
4. disponibilizar o artefato para implantação;
5. realizar o deploy em ambientes como staging;
6. deixar a produção pronta para implantação.

Exemplo:

```text
git push
   ↓
Tests ✅
   ↓
Build ✅
   ↓
Docker image
   ↓
Container Registry
   ↓
Staging
   ↓
Aprovação manual
   ↓
Production
```

A principal característica do **Continuous Delivery** é que o software está continuamente sendo preparado para implantação, mas a implantação em produção pode depender de uma aprovação manual.

---

# CD — Continuous Deployment

**Continuous Deployment (Implantação Contínua)** vai além do Continuous Delivery.

Nesse modelo, após todas as validações serem aprovadas, o sistema realiza automaticamente a implantação em produção.

Exemplo:

```text
git push
   ↓
Tests ✅
   ↓
Build ✅
   ↓
Docker image ✅
   ↓
Push Registry ✅
   ↓
Deploy Staging ✅
   ↓
Deploy Production 🚀
```

Nesse cenário, não existe uma aprovação manual entre a pipeline e a produção.

Isso significa que:

> Se todas as etapas configuradas forem aprovadas, a nova versão poderá ser automaticamente implantada em produção.

---

# Continuous Delivery vs Continuous Deployment

A diferença pode ser resumida da seguinte forma:

### Continuous Delivery

```text
Code
 ↓
Test
 ↓
Build
 ↓
Package
 ↓
Staging
 ↓
Ready for Production
 ↓
Manual approval
 ↓
Production
```

### Continuous Deployment

```text
Code
 ↓
Test
 ↓
Build
 ↓
Package
 ↓
Staging
 ↓
Production 🚀
```

Portanto:

> **Continuous Delivery:** o software é automaticamente preparado para produção.

> **Continuous Deployment:** o software também é automaticamente implantado em produção.

---

# Exemplo de Pipeline Completa

Uma aplicação real pode possuir uma pipeline semelhante a:

```text
                         Git Push
                            │
                            ▼
                    ┌──────────────┐
                    │     GitLab   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Pipeline   │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
         Test           Security        Build
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                    GitLab Runner
                           │
                           ▼
                    Docker Build
                           │
                           ▼
                  Container Registry
                           │
                           ▼
                        Staging
                           │
                           ▼
                    Production 🚀
```

---

# Exemplo com uma aplicação Spring Boot

Para uma aplicação **Java + Spring Boot + Docker**, uma pipeline poderia ser:

```text
git push
   │
   ▼
GitLab
   │
   ▼
Pipeline
   │
   ├── Test
   │    ├── mvn test
   │    └── Integration tests
   │
   ├── Build
   │    └── mvn package
   │
   ├── Docker
   │    ├── docker build
   │    └── docker push
   │
   └── Deploy
        └── docker compose up
```

Uma implementação mais completa poderia ser:

```text
Developer
    │
    │ git push
    ▼
 GitLab
    │
    ▼
┌─────────────────────┐
│       Pipeline      │
├─────────────────────┤
│                     │
│ Test                │
│  ├─ Unit Tests      │
│  └─ Integration     │
│                     │
│ Build               │
│  └─ Maven Package   │
│                     │
│ Docker              │
│  ├─ Build Image     │
│  └─ Push Registry   │
│                     │
│ Deploy              │
│  └─ Deploy VM       │
│                     │
└──────────┬──────────┘
           │
           ▼
     GitLab Runner
           │
           ▼
       Production
```

---

# CI/CD + Git Hooks

Ferramentas como **Husky** podem complementar o CI/CD, mas não o substituem.

Por exemplo:

```text
Developer
    │
    ▼
Git Hook / Husky
    │
    ├── Lint
    └── Tests
    │
    ▼
git push
    │
    ▼
GitLab CI/CD
    │
    ├── Lint
    ├── Tests
    ├── Build
    ├── Security
    └── Deploy
```

O Husky executa verificações localmente antes de determinadas operações do Git.

O GitLab CI/CD executa as verificações em um ambiente controlado pelo projeto.

Isso é importante porque um desenvolvedor pode ignorar hooks locais, por exemplo:

```bash
git commit --no-verify
```

Por isso, **as validações importantes devem continuar existindo no CI**.

---

# Resumo

| Conceito               | Responsabilidade                              |
| ---------------------- | --------------------------------------------- |
| **CI**                 | Integrar e validar alterações automaticamente |
| **CD — Delivery**      | Preparar o software para entrega/produção     |
| **CD — Deployment**    | Implantar automaticamente o software          |
| **Pipeline**           | Fluxo completo de execução do CI/CD           |
| **Stage**              | Etapa lógica da pipeline                      |
| **Job**                | Unidade de execução dentro de um stage        |
| **`.gitlab-ci.yml`**   | Arquivo que define a pipeline                 |
| **GitLab Runner**      | Executa os jobs da pipeline                   |
| **Container Registry** | Armazena imagens Docker                       |
| **Husky**              | Executa hooks e validações localmente         |

A ideia central pode ser resumida em:

```text
                  CI/CD
                    │
                    ▼
               ┌─────────┐
               │ GitLab  │
               └────┬────┘
                    │
                    ▼
                Pipeline
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
       Test        Build       Deploy
        │           │           │
        └───────────┼───────────┘
                    │
                    ▼
             GitLab Runner
                    │
                    ▼
              Environment
                    │
                    ▼
              Production 🚀
```

O objetivo final do CI/CD é transformar o processo de entrega de software de uma sequência de tarefas manuais em um **processo automatizado, repetível, rastreável e confiável**.
