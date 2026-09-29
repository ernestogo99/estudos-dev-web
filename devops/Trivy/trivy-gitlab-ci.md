# Trivy

## 1. O que é o Trivy?

**Trivy** é uma ferramenta de segurança desenvolvida pela Aqua Security utilizada para analisar aplicações, sistemas de arquivos, repositórios e principalmente **imagens Docker/OCI** em busca de problemas de segurança.

Ele pode identificar:

- Vulnerabilidades conhecidas (CVEs);
- Vulnerabilidades em dependências de aplicações;
- Secrets expostos;
- Más configurações;
- Problemas em arquivos de Infrastructure as Code (IaC);
- Informações relacionadas a licenças.

Documentação oficial:

```text
https://trivy.dev/
```

Video de apoio:

```
https://www.youtube.com/watch?v=1uNdMv8UBlE
```

O Trivy pode ser utilizado tanto localmente durante o desenvolvimento quanto dentro de uma pipeline de CI/CD.

---

## 2. Por que utilizar o Trivy?

Uma aplicação pode funcionar corretamente e ainda possuir vulnerabilidades de segurança.

Por exemplo, um `Dockerfile` pode utilizar uma imagem base antiga:

```dockerfile
FROM node:18-alpine
```

Essa imagem pode conter pacotes com vulnerabilidades conhecidas.

Mesmo que o código da aplicação esteja correto, a imagem final pode apresentar riscos.

O Trivy permite automatizar essa verificação.

A ideia é:

```text
Código
   ↓
Build da aplicação
   ↓
Docker Image
   ↓
Trivy
   ↓
Existem vulnerabilidades?
   ├── SIM → Pipeline pode falhar
   └── NÃO → Pipeline continua
   ↓
Deploy
```

Dessa forma, problemas podem ser identificados **antes que a imagem chegue ao ambiente de produção**.

---

# 3. O que o Trivy consegue analisar?

O Trivy possui diferentes tipos de análise.

## 3.1. Imagens Docker

É um dos usos mais comuns.

```bash
trivy image minha-aplicacao:latest
```

O Trivy analisa os componentes presentes dentro da imagem e procura vulnerabilidades conhecidas.

Por exemplo:

```text
minha-aplicacao:latest

OS Packages
├── openssl
├── curl
├── libc
└── ...

Application Dependencies
├── Spring Boot
├── Jackson
├── Logback
└── ...
```

A documentação do Trivy informa que a análise de imagens pode detectar vulnerabilidades, secrets, configurações e licenças.

---

## 3.2. Sistema de arquivos

Também é possível analisar diretamente o projeto:

```bash
trivy fs .
```

Isso pode ser útil para encontrar vulnerabilidades em dependências antes mesmo da criação da imagem Docker.

Por exemplo:

```text
Projeto
├── pom.xml
├── package.json
├── package-lock.json
├── Dockerfile
└── src/
```

O Trivy pode analisar os arquivos de dependências encontrados no projeto.

---

## 3.3. Repositório Git

O Trivy também possui um modo específico para repositórios:

```bash
trivy repo .
```

Esse modo pode analisar o repositório em busca de:

- Vulnerabilidades;
- Secrets;
- Más configurações;
- Licenças.

Isso é especialmente útil para integrar verificações de segurança ao processo de CI/CD.

---

## 3.4. Infrastructure as Code

O Trivy também pode verificar arquivos de infraestrutura.

Exemplos:

- Dockerfile;
- Kubernetes;
- Terraform;
- CloudFormation;
- Helm;
- Outros arquivos de configuração suportados.

Exemplo:

```bash
trivy config .
```

Um problema possível seria:

```dockerfile
FROM alpine
```

O scanner pode identificar configurações que deveriam ser melhoradas, como imagens sem uma versão/tag explicitamente definida.

---

# 4. Trivy e vulnerabilidades

O Trivy utiliza bancos de dados de vulnerabilidades para identificar problemas conhecidos.

Uma vulnerabilidade pode possuir um identificador como:

```text
CVE-2026-XXXXX
```

O resultado pode apresentar informações como:

```text
Library        Vulnerability      Severity
------------------------------------------------
openssl        CVE-2026-XXXXX     HIGH
curl           CVE-2026-YYYYY     MEDIUM
libxml2        CVE-2026-ZZZZZ     CRITICAL
```

As severidades normalmente são classificadas como:

```text
UNKNOWN
LOW
MEDIUM
HIGH
CRITICAL
```

Isso permite definir uma política para a pipeline.

Por exemplo:

```text
LOW       → Pipeline continua
MEDIUM    → Pipeline continua
HIGH      → Avaliar
CRITICAL  → Pipeline falha
```

A política exata deve ser definida de acordo com os critérios de segurança do projeto.

---

# 5. Trivy e Secrets

Além de vulnerabilidades, o Trivy também consegue detectar possíveis secrets expostos.

Exemplos:

- API Keys;
- Tokens;
- Senhas;
- Chaves de acesso;
- Tokens do GitHub;
- Tokens do GitLab;
- Credenciais de serviços.

Por exemplo:

```yaml
database:
  password: "MinhaSenha123"
```

ou:

```typescript
const API_KEY = "sk-abc123xyz";
```

Esses valores podem ser identificados como possíveis secrets.

### Importante

O Trivy **não substitui um mecanismo de gerenciamento de secrets**.

Assim como acontece com ferramentas especializadas como o Gitleaks, o objetivo é detectar uma possível exposição.

Uma aplicação deve preferir mecanismos como:

```text
GitLab CI/CD Variables
        ↓
Variável de ambiente
        ↓
Aplicação
```

em vez de armazenar credenciais diretamente no código.

---

# 6. Trivy + Docker

Considere uma aplicação com o seguinte Dockerfile:

```dockerfile
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

COPY target/app.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
```

Depois de criar a imagem:

```bash
docker build -t minha-aplicacao:latest .
```

podemos executar:

```bash
trivy image minha-aplicacao:latest
```

O Trivy irá analisar a imagem criada.

Fluxo:

```text
Dockerfile
    ↓
docker build
    ↓
Docker Image
    ↓
trivy image
    ↓
Vulnerabilidades
```

---

# 7. Integrando o Trivy ao GitLab CI/CD

Uma das principais vantagens do Trivy é poder executar a análise automaticamente dentro da pipeline.

Uma pipeline pode ser organizada assim:

```text
Git Push
   ↓
GitLab CI/CD
   ↓
Tests
   ↓
Build
   ↓
Docker Image
   ↓
Trivy
   ↓
Vulnerabilidades?
   ├── SIM → Pipeline falha
   └── NÃO → Deploy
```

O GitLab possui integração de **Container Scanning utilizando Trivy**.

---

# 8. Método 1 — Container Scanning do GitLab

O GitLab fornece um template de Container Scanning que utiliza Trivy.

Uma configuração básica pode ser:

```yaml
include:
  - template: Jobs/Container-Scanning.gitlab-ci.yml
```

O job de Container Scanning pode então ser configurado para analisar a imagem criada pelo projeto.

Por exemplo:

```yaml
include:
  - template: Jobs/Container-Scanning.gitlab-ci.yml

stages:
  - test
  - build
  - security
  - deploy

container_scanning:
  stage: security
  variables:
    CS_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

Nesse cenário, a imagem precisa estar disponível no Container Registry para ser analisada.

---

# 9. Exemplo completo com Docker e Trivy

Um fluxo comum é:

```text
                    GitLab
                       │
                       ▼
                    Testes
                       │
                       ▼
                 Docker Build
                       │
                       ▼
                Docker Registry
                       │
                       ▼
                     Trivy
                       │
              ┌────────┴────────┐
              │                 │
       Vulnerabilidade       Sem problema
              │                 │
              ▼                 ▼
        ❌ Pipeline           Deploy
           falha
```

Exemplo:

```yaml
stages:
  - test
  - build
  - security
  - deploy

test:
  stage: test
  image: maven:3.9.14-eclipse-temurin-25-alpine
  script:
    - mvn clean test -B

build-image:
  stage: build
  image: docker:cli
  services:
    - docker:dind
  script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY"
    - docker build -t "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA" .
    - docker push "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"

include:
  - template: Jobs/Container-Scanning.gitlab-ci.yml

container_scanning:
  stage: security
  variables:
    CS_IMAGE: "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"

deploy:
  stage: deploy
  script:
    - echo "Deploy da aplicação"
```

A ideia principal é:

```text
test
 ↓
build-image
 ↓
container_scanning
 ↓
deploy
```

Se o scanner encontrar problemas de acordo com a configuração adotada para o job, a etapa de segurança pode impedir que o pipeline avance.

---

# 10. Definindo um limite de severidade

É possível definir um limite para os resultados encontrados.

Por exemplo:

```yaml
container_scanning:
  stage: security
  variables:
    CS_IMAGE: "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
    CS_SEVERITY_THRESHOLD: "HIGH"
```

Nesse exemplo, o objetivo é concentrar o relatório em vulnerabilidades de severidade:

```text
HIGH
CRITICAL
```

Os valores suportados incluem:

```text
UNKNOWN
LOW
MEDIUM
HIGH
CRITICAL
```

O limite escolhido deve fazer parte da política de segurança do projeto.

---

# 11. Método 2 — Executando o Trivy diretamente

Também podemos executar o Trivy diretamente dentro de um job do GitLab.

Por exemplo:

```yaml
trivy:
  stage: security
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  script:
    - trivy image --exit-code 1 --severity HIGH,CRITICAL "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
```

Nesse exemplo:

```bash
--exit-code 1
```

faz com que o comando retorne código de erro quando encontrar resultados que atendam ao filtro.

E:

```bash
--severity HIGH,CRITICAL
```

define as severidades que serão consideradas.

Fluxo:

```text
Trivy
  ↓
HIGH ou CRITICAL encontrado?
  ├── SIM → exit code 1 → Job FAILED
  └── NÃO → exit code 0 → Job SUCCESS
```

---

# 12. Comparando Gitleaks e Trivy

As duas ferramentas podem ser utilizadas juntas.

```text
                 GitLab CI/CD
                      │
          ┌───────────┴───────────┐
          │                       │
       Gitleaks                 Trivy
          │                       │
          ▼                       ▼
      Secrets              Vulnerabilidades
      expostos              em imagens
          │                       │
          └───────────┬───────────┘
                      ▼
                 Security Gate
                      │
             ┌────────┴────────┐
             │                 │
            ❌                ✅
         Problema          Seguro o suficiente
             │                 │
          Pipeline            Build
            para                ↓
                              Deploy
```

### Gitleaks

Principal objetivo:

```text
Detectar secrets expostos
```

Exemplos:

- Senhas;
- API Keys;
- Tokens;
- Chaves privadas.

### Trivy

Principal objetivo:

```text
Detectar vulnerabilidades e problemas de segurança
```

Exemplos:

- Vulnerabilidades em pacotes;
- Vulnerabilidades em dependências;
- Problemas em imagens Docker;
- Más configurações;
- Secrets;
- Problemas em IaC.

Portanto, utilizar os dois pode fornecer uma cobertura maior.

---

# 13. Trivy em um projeto Spring Boot

Considere um projeto:

```text
spring-backend/
│
├── src/
├── pom.xml
├── Dockerfile
├── .gitlab-ci.yml
└── ...
```

O pipeline pode ser:

```text
                    Git Push
                       │
                       ▼
                    Gitleaks
                       │
                       ▼
                    Maven Test
                       │
                       ▼
                 Docker Build
                       │
                       ▼
                 Docker Registry
                       │
                       ▼
                    Trivy
                       │
                       ▼
                    Deploy
```

Uma configuração simplificada:

```yaml
stages:
  - security
  - test
  - build
  - container-security
  - deploy

gitleaks:
  stage: security
  image:
    name: zricethezav/gitleaks:latest
    entrypoint: [""]
  script:
    - gitleaks detect --source . --verbose

test:
  stage: test
  image: maven:3.9.14-eclipse-temurin-25-alpine
  script:
    - mvn clean test -B

build:
  stage: build
  script:
    - echo "Build da aplicação"

trivy:
  stage: container-security
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  script:
    - trivy fs --scanners vuln,misconfig,secret --severity HIGH,CRITICAL .

deploy:
  stage: deploy
  script:
    - echo "Deploy da aplicação"
```

Nesse exemplo existem duas abordagens diferentes:

```text
Gitleaks
   ↓
Analisa secrets no repositório

Trivy
   ↓
Analisa vulnerabilidades, configurações e secrets
```

Para uma pipeline que já cria uma imagem Docker, é interessante também analisar **a imagem final**, pois ela representa exatamente o artefato que será executado no ambiente.

---

# 14. Trivy analisando a imagem final

Depois do build:

```bash
docker build -t minha-aplicacao:$CI_COMMIT_SHA .
```

podemos executar:

```bash
trivy image \
  --severity HIGH,CRITICAL \
  --exit-code 1 \
  minha-aplicacao:$CI_COMMIT_SHA
```

Fluxo:

```text
Dockerfile
    ↓
Docker Build
    ↓
Imagem
    ↓
Trivy Image Scan
    ↓
┌───────────────────────────┐
│ HIGH / CRITICAL encontrada?│
└─────────────┬─────────────┘
              │
       ┌──────┴──────┐
       │             │
      SIM           NÃO
       │             │
       ▼             ▼
   Pipeline        Pipeline
     falha         continua
```

Essa abordagem é especialmente importante porque permite verificar o artefato que será efetivamente utilizado no deploy.

---

# 15. Relatórios do Trivy

O Trivy também pode gerar resultados em diferentes formatos.

Por exemplo:

```bash
trivy image \
  --format json \
  --output trivy-report.json \
  minha-aplicacao:latest
```

O resultado poderá ser armazenado como artefato do GitLab:

```yaml
trivy:
  stage: security
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  script:
    - trivy image --format json --output trivy-report.json "$IMAGE"
  artifacts:
    when: always
    paths:
      - trivy-report.json
```

Dessa maneira, o relatório pode ser consultado posteriormente.

---

# 16. Trivy + GitLab Container Registry

Uma arquitetura bastante comum é utilizar o Container Registry do próprio GitLab.

```text
GitLab Repository
       │
       ▼
GitLab CI/CD
       │
       ▼
Docker Build
       │
       ▼
GitLab Container Registry
       │
       ▼
Trivy
       │
       ▼
Security Check
       │
       ▼
Deploy
```

A imagem pode utilizar:

```yaml
$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

Por exemplo:

```text
registry.gitlab.com/empresa/projeto/backend:a1b2c3d
```

O uso do SHA do commit evita depender de tags genéricas como:

```text
latest
```

e permite associar diretamente uma imagem a uma versão específica do código.

---

# 17. Trivy e Dockerfile

Além de analisar a imagem, podemos analisar o próprio Dockerfile.

Exemplo:

```bash
trivy config Dockerfile
```

Ou:

```bash
trivy config .
```

Isso permite identificar problemas de configuração antes do deploy.

Exemplo conceitual:

```dockerfile
FROM ubuntu:latest
```

Uma análise pode apontar que utilizar uma tag flutuante como `latest` dificulta a reprodutibilidade.

Uma alternativa é utilizar uma versão explicitamente definida:

```dockerfile
FROM ubuntu:24.04
```

---

# 18. Trivy no desenvolvimento local

O Trivy não precisa ser executado apenas no GitLab.

Um desenvolvedor pode executar:

```bash
trivy image minha-aplicacao:latest
```

antes de enviar a alteração para o GitLab.

Também pode executar:

```bash
trivy fs .
```

ou:

```bash
trivy config .
```

Assim:

```text
Desenvolvedor
     │
     ▼
Trivy local
     │
     ▼
Git Push
     │
     ▼
GitLab CI/CD
     │
     ▼
Trivy novamente
```

A análise local fornece feedback rápido, enquanto a pipeline funciona como uma segunda barreira de segurança.

---

# 19. Gitleaks + Trivy na pipeline

Uma pipeline mais completa pode utilizar:

```text
                  GitLab CI/CD
                       │
                       ▼
              ┌─────────────────┐
              │     Gitleaks    │
              │ Secrets expostos│
              └────────┬────────┘
                       │
                       ▼
                    Tests
                       │
                       ▼
                 Docker Build
                       │
                       ▼
              Docker Registry
                       │
                       ▼
              ┌─────────────────┐
              │      Trivy      │
              │ Vulnerabilidades│
              └────────┬────────┘
                       │
                       ▼
                     Deploy
```

Nesse cenário:

```text
Gitleaks → protege contra secrets expostos

Trivy → verifica vulnerabilidades e configurações

Testes → verificam comportamento da aplicação

Build → cria o artefato

Deploy → publica somente após as verificações
```

---

# 20. Boas práticas

### Não ignorar vulnerabilidades sem investigar

Se o Trivy encontrar:

```text
CRITICAL
```

não é recomendado simplesmente ignorar o resultado.

Primeiro deve-se verificar:

- Qual pacote possui a vulnerabilidade;
- Qual versão está instalada;
- Se existe uma versão corrigida;
- Se a vulnerabilidade realmente afeta a aplicação;
- Qual é o impacto para o projeto.

---

### Atualizar imagens base

Evite manter imagens antigas por muito tempo.

Por exemplo:

```dockerfile
FROM node:18-alpine
```

ou:

```dockerfile
FROM eclipse-temurin:17-jre
```

podem eventualmente conter componentes vulneráveis.

A atualização da imagem base pode corrigir vulnerabilidades sem alterar diretamente o código da aplicação.

---

### Utilizar versões específicas

Quando possível, prefira versões explícitas:

```dockerfile
FROM eclipse-temurin:25-jre-alpine
```

em vez de depender de tags excessivamente genéricas.

---

### Não utilizar o Trivy como única camada de segurança

Uma estratégia de segurança pode combinar:

```text
Gitleaks
   +
Trivy
   +
SAST
   +
Dependency Scanning
   +
Testes
   +
Code Quality
```

Cada ferramenta possui um objetivo diferente.

---

# 21. Exemplo de pipeline completa

Uma estrutura possível:

```yaml
stages:
  - security
  - test
  - build
  - container-security
  - deploy

gitleaks:
  stage: security
  image:
    name: zricethezav/gitleaks:latest
    entrypoint: [""]
  script:
    - gitleaks detect --source . --verbose

test:
  stage: test
  image: maven:3.9.14-eclipse-temurin-25-alpine
  script:
    - mvn clean test -B

build-image:
  stage: build
  image: docker:cli
  services:
    - docker:dind
  script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY"
    - docker build -t "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA" .
    - docker push "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"

include:
  - template: Jobs/Container-Scanning.gitlab-ci.yml

container_scanning:
  stage: container-security
  variables:
    CS_IMAGE: "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
    CS_SEVERITY_THRESHOLD: "HIGH"

deploy:
  stage: deploy
  script:
    - echo "Deploy da aplicação"
```

A ideia final é:

```text
                Developer
                    │
                    ▼
                 Git Push
                    │
                    ▼
              GitLab Pipeline
                    │
                    ▼
                Gitleaks
                    │
              Secrets?
              /       \
            SIM       NÃO
             │         │
          ❌ STOP     Tests
                        │
                        ▼
                   Docker Build
                        │
                        ▼
                  Registry
                        │
                        ▼
                      Trivy
                        │
               Vulnerabilidade?
                  /          \
                SIM          NÃO
                 │             │
              ❌ STOP        Deploy
```

---

# 22. Resumo

| Item                                        | Trivy                |
| ------------------------------------------- | -------------------- |
| Objetivo                                    | Análise de segurança |
| Vulnerabilidades                            | ✅                   |
| Imagens Docker                              | ✅                   |
| Dependências                                | ✅                   |
| Secrets                                     | ✅                   |
| Misconfigurations                           | ✅                   |
| Dockerfile                                  | ✅                   |
| Kubernetes/IaC                              | ✅                   |
| Repositórios Git                            | ✅                   |
| Licenças                                    | ✅                   |
| Integração GitLab CI/CD                     | ✅                   |
| Pode bloquear pipeline                      | ✅                   |
| Substitui Secret Manager                    | ❌                   |
| Substitui todas as ferramentas de segurança | ❌                   |

## Conceito principal

O Trivy funciona como uma **barreira de segurança no processo de CI/CD**, especialmente útil para verificar as imagens Docker que serão utilizadas pela aplicação.

```text
Developer
    │
    ▼
Git Push
    │
    ▼
GitLab CI/CD
    │
    ├───────────────┐
    ▼               ▼
Gitleaks          Tests
    │               │
    ▼               ▼
Secrets          Build
    │               │
    └───────┬───────┘
            ▼
       Docker Image
            │
            ▼
          Trivy
            │
            ▼
   Vulnerabilidades?
       │          │
      SIM        NÃO
       │          │
       ▼          ▼
    ❌ STOP     Deploy
```

O objetivo é fazer com que **problemas de segurança sejam encontrados o mais cedo possível**, reduzindo a possibilidade de uma imagem vulnerável chegar ao ambiente de produção.

---

## 23. Documentação

Documentação oficial do Trivy:

```text
https://trivy.dev/
```

Documentação do GitLab sobre Container Scanning:

```text
https://docs.gitlab.com/user/application_security/container_scanning/
```

Tutorial do GitLab para Container Scanning:

```text
https://docs.gitlab.com/tutorials/container_scanning/
```
