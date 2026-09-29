# OWASP ZAP

## 1. O que é o OWASP ZAP?

O **OWASP ZAP (Zed Attack Proxy)** é uma ferramenta gratuita e open source utilizada para realizar **testes de segurança em aplicações web e APIs**.

Ele funciona como um proxy de segurança que permite observar e testar a comunicação entre o cliente e a aplicação.

Pode identificar problemas como:

- Cross-Site Scripting (XSS);
- SQL Injection;
- CSRF;
- Headers de segurança ausentes;
- Cookies configurados de forma insegura;
- Informações sensíveis expostas;
- Configurações inseguras;
- Outros problemas de segurança em aplicações web.

Documentação oficial:

```text
https://www.zaproxy.org/docs/
```

Video de apoio

```
https://www.youtube.com/watch?v=VcV7H-pyEEo
```

O ZAP é uma ferramenta muito utilizada no contexto de **DAST (Dynamic Application Security Testing)**.

---

# 2. O que é DAST?

**DAST** significa:

```text
Dynamic Application Security Testing
```

Em português:

```text
Teste Dinâmico de Segurança de Aplicações
```

A principal característica do DAST é analisar a aplicação **em execução**.

```text
Código-fonte
    ↓
Build
    ↓
Aplicação executando
    ↓
OWASP ZAP
    ↓
Testes de segurança
```

O ZAP interage com a aplicação como um cliente externo.

---

# 3. SonarQube x OWASP ZAP

O **SonarQube** analisa principalmente o código:

```text
Código-fonte
     ↓
SonarQube
     ↓
Bugs
Code Smells
Vulnerabilidades
Duplicação
Complexidade
```

O **OWASP ZAP** analisa a aplicação em execução:

```text
Aplicação
     ↓
OWASP ZAP
     ↓
HTTP / HTTPS
     ↓
Vulnerabilidades
```

De forma simplificada:

```text
SonarQube
    ↓
Static Analysis

OWASP ZAP
    ↓
Dynamic Analysis
```

As duas abordagens são complementares.

---

# 4. Como o ZAP funciona?

O ZAP pode atuar como intermediário entre o cliente e a aplicação:

```text
Browser
   │
   ▼
 OWASP ZAP
   │
   ▼
Aplicação
```

Ele pode:

- descobrir URLs;
- analisar respostas HTTP;
- verificar headers;
- analisar cookies;
- identificar padrões suspeitos;
- realizar testes ativos, quando configurado.

---

# 5. Spider / Crawling

Uma análise dinâmica precisa descobrir a superfície da aplicação.

Por exemplo:

```text
/
├── /login
├── /users
├── /products
├── /orders
├── /admin
└── /api
```

O ZAP pode navegar pela aplicação para descobrir esses recursos.

```text
Aplicação
    ↓
Crawler / Spider
    ↓
URLs descobertas
    ↓
Security Scan
```

---

# 6. Passive Scan

O **Passive Scan** analisa requisições e respostas sem realizar ataques ativos.

Pode verificar aspectos como:

- Headers;
- Cookies;
- Conteúdo das respostas;
- Informações potencialmente sensíveis;
- Configurações de segurança.

O **Baseline Scan** do ZAP utiliza crawling e análise passiva e, por padrão, não realiza ataques ativos.

Isso o torna uma boa opção para começar uma integração com CI/CD.

---

# 7. Active Scan

O **Active Scan** vai além da análise passiva.

Ele envia requisições especialmente construídas para tentar identificar vulnerabilidades.

```text
ZAP
 │
 ├── Requisição normal
 ├── Payload de teste
 ├── Payload de teste
 └── Payload de teste
        ↓
     Aplicação
        ↓
      Resposta
        ↓
       ZAP
```

Pode investigar problemas como:

```text
XSS
SQL Injection
Command Injection
Path Traversal
```

### Importante

Scans ativos devem ser executados em ambientes de teste. Eles podem modificar dados ou provocar efeitos não desejados.

O GitLab recomenda não executar DAST contra produção, pois testes ativos podem modificar ou causar perda de dados.

---

# 8. ZAP Baseline Scan

O ZAP fornece um **Baseline Scan** específico para automação.

Exemplo:

```bash
zap-baseline.py -t https://example.com
```

O Baseline Scan realiza crawling e análise passiva e, por padrão, não realiza ataques ativos.

A documentação oficial do ZAP indica o Baseline Scan como adequado para ambientes de CI/CD.

---

# 9. ZAP Full Scan

Também existe o **Full Scan**:

```bash
zap-full-scan.py -t https://example.com
```

De forma simplificada:

```text
Baseline
   ↓
Crawl + Passive Scan
```

Enquanto:

```text
Full Scan
   ↓
Crawl
   ↓
Passive Scan
   ↓
Active Scan
```

O Full Scan é mais completo, mas também pode ser mais demorado e invasivo.

---

# 10. ZAP API Scan

O ZAP também possui um modo específico para APIs.

Isso é especialmente interessante para backends como:

```text
Spring Boot
Django
Node.js
NestJS
.NET
```

O scanner pode utilizar uma especificação OpenAPI/Swagger:

```text
openapi.yaml
     ↓
   OWASP ZAP
     ↓
Endpoints
     ↓
Security Scan
```

As imagens Docker do ZAP fornecem um **API Scan** para especificações OpenAPI ou GraphQL.

---

# 11. ZAP em Docker

O OWASP ZAP possui imagens Docker oficiais.

```bash
docker pull zaproxy/zap-stable
```

Também existem imagens no GitHub Container Registry:

```text
ghcr.io/zaproxy/zaproxy:stable
```

Isso facilita sua utilização dentro de uma pipeline.

Exemplo:

```bash
docker run \\
  zaproxy/zap-stable \\
  zap-baseline.py \\
  -t https://example.com
```

Fluxo:

```text
GitLab Runner
     ↓
Docker
     ↓
ZAP Container
     ↓
Aplicação de teste
```

---

# 12. Integrando o OWASP ZAP ao GitLab

Existem duas abordagens principais.

### Abordagem 1

Executar diretamente o Docker do ZAP:

```text
GitLab CI/CD
     ↓
ZAP Docker
     ↓
Aplicação
```

### Abordagem 2

Utilizar o DAST do GitLab:

```text
GitLab CI/CD
     ↓
DAST
     ↓
Security Analyzer
     ↓
Aplicação
```

O GitLab possui integração de DAST para encontrar vulnerabilidades em aplicações web enquanto estão executando.

---

# 13. Abordagem 1 — ZAP diretamente no `.gitlab-ci.yml`

Uma forma simples é executar a imagem do ZAP diretamente.

```yaml
stages:
  - build
  - deploy-test
  - security
  - deploy

zap:
  stage: security
  image:
    name: ghcr.io/zaproxy/zaproxy:stable
    entrypoint: [""]
  script:
    - >
      zap-baseline.py
      -t "$DAST_TARGET_URL"
      -r zap-report.html
  artifacts:
    when: always
    paths:
      - zap-report.html

deploy:
  stage: deploy
  script:
    - echo "Deploy da aplicação"
```

A variável `DAST_TARGET_URL` pode conter:

```text
https://staging.exemplo.com
```

Fluxo:

```text
Build
  ↓
Deploy Test
  ↓
Aplicação disponível
  ↓
OWASP ZAP
  ↓
Security Scan
  ↓
Deploy
```

---

# 14. Criando uma variável para o alvo

No GitLab:

```text
Settings
   ↓
CI/CD
   ↓
Variables
```

Adicionar:

```text
Key:
DAST_TARGET_URL

Value:
https://staging.exemplo.com
```

No pipeline:

```yaml
-t "$DAST_TARGET_URL"
```

---

# 15. Fazendo o ZAP falhar a pipeline

O Baseline Scan pode apresentar alertas sem tratar todos como erro.

Podemos utilizar um arquivo de configuração do ZAP para definir regras como:

```text
WARN
FAIL
IGNORE
```

Depois:

```bash
zap-baseline.py \\
  -t "$DAST_TARGET_URL" \\
  -c zap.conf
```

Fluxo:

```text
ZAP
 ↓
Encontrou alerta?
 ↓
Configuração
 ↓
┌───────────────┐
│               │
├── IGNORE → Continua
├── WARN   → Relatório
└── FAIL   → Pipeline falha
```

O objetivo é criar uma política específica para o projeto, em vez de simplesmente ignorar todos os alertas.

---

# 16. Gerando relatório

Podemos gerar um relatório HTML:

```bash
zap-baseline.py \\
  -t "$DAST_TARGET_URL" \\
  -r zap-report.html
```

E armazená-lo como artefato:

```yaml
artifacts:
  when: always
  paths:
    - zap-report.html
```

Fluxo:

```text
ZAP
 ↓
Scan
 ↓
Report
 ↓
GitLab Artifacts
```

---

# 17. Exemplo completo com ZAP

```yaml
stages:
  - build
  - deploy-test
  - security
  - deploy

build:
  stage: build
  script:
    - echo "Build da aplicação"

deploy-test:
  stage: deploy-test
  script:
    - echo "Deploy em ambiente de testes"

zap:
  stage: security
  image:
    name: ghcr.io/zaproxy/zaproxy:stable
    entrypoint: [""]
  script:
    - >
      zap-baseline.py
      -t "$DAST_TARGET_URL"
      -r zap-report.html
  artifacts:
    when: always
    paths:
      - zap-report.html

deploy:
  stage: deploy
  script:
    - echo "Deploy da aplicação"
```

---

# 18. ZAP + aplicação Docker

Uma situação comum é a aplicação também estar em Docker.

```text
             Docker Network
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
      backend             zap
          │                 │
          └────── HTTP ─────┘
```

A documentação oficial do ZAP apresenta essa abordagem para executar o scanner contra outra aplicação Docker.

Por exemplo:

```bash
docker network create zapnet
```

Depois:

```bash
docker run \\
  --network zapnet \\
  --name backend \\
  minha-aplicacao
```

E:

```bash
docker run \\
  --network zapnet \\
  zaproxy/zap-stable \\
  zap-baseline.py \\
  -t http://backend:8080
```

---

# 19. ZAP + GitLab DAST

Outra possibilidade é utilizar a integração DAST do GitLab.

O GitLab define DAST como uma análise dinâmica que testa aplicações em execução e procura vulnerabilidades que outras análises podem não detectar.

Uma configuração pode utilizar:

```yaml
include:
  - template: Security/DAST.gitlab-ci.yml
```

Por exemplo:

```yaml
stages:
  - build
  - deploy-test
  - dast

include:
  - template: Security/DAST.gitlab-ci.yml

dast:
  stage: dast
  variables:
    DAST_TARGET_URL: "http://yourapp:8080"
```

O GitLab executa o scanner em um container e gera um relatório de DAST.

---

# 20. Aplicação como serviço no GitLab

Quando a aplicação é uma imagem Docker, podemos executar a aplicação como um serviço no próprio job do DAST.

```yaml
build:
  stage: build
  script:
    - docker build -t "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA" .

dast:
  stage: dast
  services:
    - name: "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
      alias: yourapp

  variables:
    DAST_TARGET_URL: "http://yourapp:8080"
```

Arquitetura:

```text
GitLab Runner
      │
      ├───────────────┐
      │               │
      ▼               ▼
  Application        DAST
   Container         Scanner
      │               │
      └────── HTTP ───┘
```

---

# 21. DAST em uma aplicação Spring Boot

Imagine:

```text
Spring Boot
     │
     ▼
Docker Image
     │
     ▼
Container
     │
     ▼
http://backend:8080
```

Uma configuração conceitual:

```yaml
stages:
  - test
  - build
  - dast

test:
  stage: test
  image: maven:3.9.14-eclipse-temurin-25-alpine
  script:
    - mvn clean test

build:
  stage: build
  script:
    - echo "Build Docker"

include:
  - template: Security/DAST.gitlab-ci.yml

dast:
  stage: dast
  variables:
    DAST_TARGET_URL: "http://backend:8080"
```

O endereço informado para o scanner precisa estar acessível a partir do GitLab Runner.

---

# 22. A aplicação precisa estar executando

Uma diferença importante entre SonarQube e ZAP:

### SonarQube

```text
Código
   ↓
SonarQube
```

### ZAP

```text
Código
   ↓
Build
   ↓
Aplicação executando
   ↓
ZAP
```

Portanto:

```text
SonarQube
→ Código pode ser analisado antes da aplicação iniciar.

ZAP
→ Aplicação precisa estar disponível para receber requisições.
```

---

# 23. Autenticação

Uma aplicação real frequentemente possui:

```text
/login
```

ou:

```text
/auth/login
```

Se o ZAP acessar apenas:

```text
https://app.com
```

pode não conseguir acessar funcionalidades protegidas.

```text
              Aplicação
                  │
             ┌────┴─────┐
             │           │
          Público     Autenticado
             │           │
             ▼           ▼
           /home      /dashboard
                         │
                         ▼
                      /admin
```

Para testar áreas autenticadas, é necessário configurar autenticação.

O GitLab DAST possui mecanismos para autenticar na aplicação e reutilizar a sessão durante a análise.

---

# 24. Credenciais de teste

Nunca devemos colocar:

```yaml
DAST_PASSWORD: "senha-real"
```

diretamente no repositório.

Prefira:

```text
GitLab CI/CD Variables
```

Por exemplo:

```text
DAST_USERNAME
DAST_PASSWORD
```

Fluxo:

```text
GitLab Variables
       │
       ▼
DAST Job
       │
       ▼
Login na aplicação
       │
       ▼
Scanner
```

É recomendável utilizar usuários de teste específicos para o ambiente de segurança.

---

# 25. Não executar Active Scan em produção

Essa é uma das práticas mais importantes.

Evite:

```text
Production
    ▲
    │
Active ZAP Scan
```

Prefira:

```text
Development
      │
      ▼
Staging / Test
      │
      ▼
Active ZAP Scan
```

O Active Scan pode enviar requisições especialmente construídas e potencialmente modificar dados.

A documentação do GitLab recomenda que DAST não seja executado contra produção.

---

# 26. Pipeline completa com Gitleaks + SonarQube + Trivy + ZAP

```text
                         GitLab
                            │
                            ▼
                         Push / MR
                            │
                            ▼
                    ┌───────────────┐
                    │   Gitleaks    │
                    │ Secrets       │
                    └───────┬───────┘
                            │
                            ▼
                          Tests
                            │
                            ▼
                    ┌───────────────┐
                    │   SonarQube   │
                    │ Code Quality  │
                    └───────┬───────┘
                            │
                            ▼
                      Quality Gate
                            │
                            ▼
                         Build
                            │
                            ▼
                     Docker Image
                            │
                  ┌─────────┴─────────┐
                  │                   │
                  ▼                   ▼
                Trivy                Test
              Image Scan           Deploy
                  │                   │
                  └─────────┬─────────┘
                            ▼
                         OWASP ZAP
                            │
                            ▼
                       DAST Scan
                            │
                            ▼
                         Deploy
```

Responsabilidades:

```text
Gitleaks
   ↓
Secrets

SonarQube
   ↓
Qualidade + Segurança do código

Trivy
   ↓
Vulnerabilidades da imagem

OWASP ZAP
   ↓
Segurança da aplicação em execução
```

---

# 27. Diferença entre as quatro ferramentas

| Ferramenta | O que analisa                                 |
| ---------- | --------------------------------------------- |
| Gitleaks   | Secrets no código/histórico                   |
| SonarQube  | Qualidade e segurança do código               |
| Trivy      | Imagens, dependências, IaC e vulnerabilidades |
| OWASP ZAP  | Aplicação web/API em execução                 |

Podemos representar:

```text
Código
  │
  ├── Gitleaks
  │
  └── SonarQube
        │
        ▼
      Build
        │
        ▼
   Docker Image
        │
        └── Trivy
              │
              ▼
       Aplicação Executando
              │
              └── OWASP ZAP
```

---

# 28. Exemplo de pipeline completa

```yaml
stages:
  - security
  - test
  - quality
  - build
  - container-security
  - deploy-test
  - dast
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

sonarqube:
  stage: quality
  image: maven:3.9.14-eclipse-temurin-25-alpine
  variables:
    SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"
    GIT_DEPTH: "0"
  cache:
    key: "${CI_JOB_NAME}"
    paths:
      - .sonar/cache
  script:
    - mvn clean verify
    - >
      mvn org.sonarsource.scanner.maven:sonar-maven-plugin:sonar
      -Dsonar.qualitygate.wait=true

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
    - echo "Scan da imagem Docker"

deploy-test:
  stage: deploy-test
  script:
    - echo "Deploy em ambiente de testes"

zap:
  stage: dast
  image:
    name: ghcr.io/zaproxy/zaproxy:stable
    entrypoint: [""]
  script:
    - >
      zap-baseline.py
      -t "$DAST_TARGET_URL"
      -r zap-report.html
  artifacts:
    when: always
    paths:
      - zap-report.html

deploy:
  stage: deploy
  script:
    - echo "Deploy da aplicação"
```

A ordem:

```text
security
   ↓
Gitleaks
   ↓
test
   ↓
SonarQube
   ↓
Quality Gate
   ↓
build
   ↓
Trivy
   ↓
deploy-test
   ↓
OWASP ZAP
   ↓
DAST
   ↓
deploy
```

---

# 29. Baseline x Full Scan

| Característica | Baseline                                 | Full               |
| -------------- | ---------------------------------------- | ------------------ |
| Crawl          | ✅                                       | ✅                 |
| Passive Scan   | ✅                                       | ✅                 |
| Active Scan    | ❌                                       | ✅                 |
| Rápido         | ✅                                       | ❌                 |
| Mais invasivo  | ❌                                       | ✅                 |
| CI/CD          | ✅                                       | ✅                 |
| Produção       | Pode ser utilizado conforme configuração | ❌ Não recomendado |

O **Baseline Scan** é uma boa opção para começar a integração.

Depois, pode-se criar um processo separado para Active/Full Scan em um ambiente de testes.

---

# 30. ZAP para APIs

Para um backend Spring Boot com Swagger/OpenAPI:

```text
Spring Boot
    │
    ▼
OpenAPI / Swagger
    │
    ▼
openapi.yaml
    │
    ▼
OWASP ZAP
    │
    ▼
API Security Scan
```

Isso permite que o scanner conheça os endpoints da API.

---

# 31. Relatórios

O ZAP pode gerar relatórios.

```bash
zap-baseline.py \\
  -t "$DAST_TARGET_URL" \\
  -r zap-report.html
```

Podemos armazenar:

```yaml
artifacts:
  when: always
  paths:
    - zap-report.html
```

Fluxo:

```text
ZAP
 ↓
Scan
 ↓
Report
 ↓
GitLab Artifact
```

---

# 32. Boas práticas

### Utilizar ambiente de testes

Prefira:

```text
Staging
Test
Review App
```

para scans ativos.

### Começar com Baseline

```text
Baseline Scan
      ↓
Avaliar resultados
      ↓
Corrigir problemas
      ↓
Definir política
      ↓
Active Scan
```

### Não colocar credenciais no `.gitlab-ci.yml`

Utilize:

```text
GitLab CI/CD Variables
```

### Criar usuário de teste

Para aplicações autenticadas, utilize uma conta específica para o ambiente de segurança.

### Não bloquear a pipeline imediatamente

No início, pode ser interessante:

```text
ZAP
 ↓
Relatório
 ↓
Avaliação
```

Depois que os resultados forem compreendidos, podem ser estabelecidas regras:

```text
Vulnerabilidade crítica
        ↓
Pipeline FAIL
```

---

# 33. Resumo

| Item                               | OWASP ZAP |
| ---------------------------------- | --------- |
| Open Source                        | ✅        |
| DAST                               | ✅        |
| Aplicações Web                     | ✅        |
| APIs                               | ✅        |
| Spider/Crawling                    | ✅        |
| Passive Scan                       | ✅        |
| Active Scan                        | ✅        |
| XSS                                | ✅        |
| SQL Injection                      | ✅        |
| Headers de segurança               | ✅        |
| Cookies                            | ✅        |
| Docker                             | ✅        |
| GitLab CI/CD                       | ✅        |
| Relatórios                         | ✅        |
| Pode bloquear pipeline             | ✅        |
| Deve ser executado contra produção | ❌        |

## Conceito principal

O OWASP ZAP funciona como uma **barreira de segurança dinâmica**, analisando a aplicação enquanto ela está executando.

```text
Developer
    │
    ▼
Git Push
    │
    ▼
GitLab CI/CD
    │
    ▼
Build
    │
    ▼
Deploy em ambiente de teste
    │
    ▼
OWASP ZAP
    │
    ▼
DAST
    │
    ├── Vulnerabilidade encontrada
    │          ↓
    │       ❌ STOP
    │
    └── Nenhum problema relevante
               ↓
             Deploy
```

A principal diferença em relação às outras ferramentas estudadas é:

```text
Gitleaks
   → Procura secrets

SonarQube
   → Analisa o código

Trivy
   → Analisa dependências, imagens e configurações

OWASP ZAP
   → Testa a aplicação em execução
```

Dessa forma, as quatro ferramentas podem formar diferentes camadas de segurança dentro de uma pipeline de CI/CD.

---

# 34. Documentação

Documentação oficial do OWASP ZAP:

```text
https://www.zaproxy.org/docs/
```

ZAP Docker:

```text
https://www.zaproxy.org/docs/docker/
```

ZAP Baseline Scan:

```text
https://www.zaproxy.org/docs/docker/baseline-scan/
```

GitLab DAST:

```text
https://docs.gitlab.com/user/application_security/dast/
```

GitLab DAST Tutorial:

```text
https://docs.gitlab.com/user/application_security/dast/browser/set_up_dast_tutorial/
```

GitLab API Security Testing:

```text
https://docs.gitlab.com/user/application_security/api_security_testing/
```
