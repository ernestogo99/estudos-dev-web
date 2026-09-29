# OpenGrep

## 1. O que é o OpenGrep?

O **OpenGrep** é uma ferramenta open source de **análise estática de código (SAST)** utilizada para encontrar possíveis problemas de segurança diretamente no código-fonte.

O projeto é um fork do **Semgrep v1.100.0** e mantém compatibilidade com regras do ecossistema Semgrep. Ele também oferece saída em formatos como **JSON e SARIF**, o que facilita sua integração com ferramentas de CI/CD e plataformas de segurança.

De forma simplificada:

```text
Código-fonte
     ↓
  OpenGrep
     ↓
Análise estática
     ↓
Problemas encontrados
```

O OpenGrep não precisa executar a aplicação para realizar sua análise.

---

# 2. O que é SAST?

**SAST** significa:

```text
Static Application Security Testing
```

Em português:

```text
Teste Estático de Segurança de Aplicações
```

A ideia é analisar o código sem precisar colocar a aplicação em execução.

Por exemplo:

```text
Código Java
     ↓
OpenGrep
     ↓
Análise
     ↓
Possíveis vulnerabilidades
```

Isso é diferente de uma ferramenta DAST como o **OWASP ZAP**.

```text
OpenGrep
   ↓
SAST
   ↓
Código-fonte
```

Enquanto:

```text
OWASP ZAP
   ↓
DAST
   ↓
Aplicação executando
```

---

# 3. Por que utilizar o OpenGrep?

Imagine que uma aplicação tenha um código como:

```java
String query =
    "SELECT * FROM users WHERE name = '" + name + "'";
```

Dependendo do contexto, essa construção pode permitir SQL Injection.

Uma ferramenta de análise estática pode identificar padrões desse tipo antes que a aplicação seja implantada.

O fluxo seria:

```text
Developer
    ↓
Código
    ↓
Git Push
    ↓
GitLab CI/CD
    ↓
OpenGrep
    ↓
Vulnerabilidade encontrada?
```

Dessa forma, problemas podem ser encontrados ainda durante o desenvolvimento.

---

# 4. OpenGrep x SonarQube

Os dois podem analisar código, mas possuem objetivos e características diferentes.

## OpenGrep

O foco principal é:

```text
Segurança
     +
Análise estática baseada em regras
```

Exemplos:

```text
SQL Injection
XSS
Uso inseguro de APIs
Padrões perigosos
Fluxos de dados
```

## SonarQube

O SonarQube possui uma abordagem mais ampla de qualidade e segurança:

```text
Bugs
Code Smells
Vulnerabilidades
Duplicação
Complexidade
Cobertura
```

Podemos representar:

```text
                 Código
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
      OpenGrep           SonarQube
          │                 │
          ▼                 ▼
      Segurança        Qualidade +
      estática         Segurança
```

As ferramentas podem ser utilizadas juntas.

---

# 5. OpenGrep x OWASP ZAP

Essa diferença é ainda mais importante.

### OpenGrep

Analisa:

```text
Código-fonte
```

Exemplo:

```text
src/
 ├── controller/
 ├── service/
 └── repository/
        ↓
     OpenGrep
```

### OWASP ZAP

Analisa:

```text
Aplicação em execução
```

Exemplo:

```text
Spring Boot
    ↓
http://localhost:8080
    ↓
OWASP ZAP
```

Portanto:

```text
OpenGrep
   → SAST

OWASP ZAP
   → DAST
```

---

# 6. Como o OpenGrep analisa o código?

O OpenGrep utiliza regras para procurar padrões no código.

Uma regra pode procurar determinado comportamento.

Por exemplo, conceitualmente:

```yaml
rules:
  - id: dangerous-function
    pattern: dangerous_function(...)
    message: "Uso de função potencialmente perigosa"
    severity: WARNING
```

Quando o código contém um padrão correspondente:

```python
dangerous_function(data)
```

o OpenGrep pode produzir um finding.

O conceito é:

```text
Rule
  ↓
Pattern
  ↓
Código
  ↓
Match
  ↓
Finding
```

---

# 7. Regras compatíveis com Semgrep

Uma característica importante do OpenGrep é a compatibilidade com regras do Semgrep.

O projeto informa que regras e rulesets existentes do Semgrep podem ser utilizados no OpenGrep.

Isso facilita a migração de projetos que já possuem regras personalizadas.

Por exemplo:

```text
Regras Semgrep
      ↓
    OpenGrep
      ↓
Análise do código
```

---

# 8. Regras personalizadas

Também podemos criar nossas próprias regras.

Por exemplo:

```yaml
rules:
  - id: avoid-eval
    pattern: eval(...)
    message: "Evite utilizar eval diretamente."
    languages:
      - python
    severity: ERROR
```

A ideia é:

```text
Código da empresa
       ↓
Regras de segurança
       ↓
OpenGrep
       ↓
Finding
```

Isso permite adaptar a análise aos padrões específicos do projeto.

---

# 9. Severidade

As regras podem possuir severidades.

Por exemplo:

```text
INFO
WARNING
ERROR
```

Uma regra pode ser definida como:

```yaml
severity: ERROR
```

A política da pipeline pode então utilizar essas severidades para determinar quando uma análise deve ser considerada problemática.

---

# 10. Taint Tracking

O OpenGrep também possui recursos de **taint tracking**.

A ideia é acompanhar o fluxo de dados potencialmente perigosos.

Por exemplo:

```text
Entrada do usuário
       ↓
Request
       ↓
Variável
       ↓
Processamento
       ↓
SQL Query
```

Conceitualmente:

```text
SOURCE
  ↓
dados não confiáveis
  ↓
processamento
  ↓
SINK
  ↓
operação sensível
```

Esse tipo de análise pode ajudar a identificar caminhos de dados que apresentam risco de segurança.

O projeto do OpenGrep destaca funcionalidades de taint tracking, incluindo análise intrafuncional e assinaturas de métodos que podem representar fontes contaminadas.

---

# 11. Instalação

O projeto disponibiliza instalação rápida para Linux e macOS.

Exemplo:

```bash
curl -fsSL https://raw.githubusercontent.com/opengrep/opengrep/main/install.sh | bash
```

Também existem binários para diferentes plataformas.

Depois podemos verificar:

```bash
opengrep --version
```

---

# 12. Executando uma análise

Depois de instalado, podemos executar a análise no projeto.

Por exemplo:

```bash
opengrep scan .
```

O objetivo é:

```text
.
↓
Todos os arquivos do projeto
↓
OpenGrep
↓
Rules
↓
Findings
```

A sintaxe exata pode variar conforme a versão utilizada, portanto é importante verificar a documentação da versão instalada.

---

# 13. Saída em JSON

O OpenGrep também fornece saída em JSON.

Conceitualmente:

```bash
opengrep scan . --json
```

Podemos redirecionar:

```bash
opengrep scan . --json > opengrep-report.json
```

Assim:

```text
OpenGrep
   ↓
JSON
   ↓
opengrep-report.json
```

Esse formato é útil para processamento automático.

---

# 14. Saída em SARIF

Uma das características mais importantes para integração com o GitLab é o suporte a **SARIF**.

SARIF significa:

```text
Static Analysis Results Interchange Format
```

É um formato padronizado para resultados de ferramentas de análise estática.

O OpenGrep oferece saída SARIF.

Conceitualmente:

```text
OpenGrep
    ↓
SARIF 2.1.0
    ↓
GitLab
```

Isso permite que os findings sejam consumidos por plataformas que suportam SARIF.

---

# 15. OpenGrep + GitLab

Existem duas maneiras de utilizar o OpenGrep com GitLab.

### Opção 1 — Relatório como artifact

Podemos simplesmente gerar:

```text
opengrep-report.sarif
```

e armazená-lo como artifact.

### Opção 2 — GitLab Security Report

Podemos utilizar o suporte do GitLab para ingestão de relatórios **SARIF 2.1.0**.

O GitLab permite que scanners de terceiros que produzam SARIF sejam integrados ao gerenciamento de vulnerabilidades.

Essa segunda opção é especialmente interessante.

---

# 16. OpenGrep como Security Report do GitLab

A estrutura básica é:

```yaml
opengrep:
  script:
    - <comando-do-opengrep>
  artifacts:
    reports:
      sarif: opengrep.sarif
```

O GitLab então pode processar o arquivo SARIF.

Os findings podem aparecer em áreas como:

```text
Pipeline Security
       ↓
Vulnerability Report
       ↓
Security Dashboard
       ↓
Merge Request Security Widget
```

Esse suporte do GitLab é baseado em SARIF 2.1.0.

---

# 17. Exemplo básico de `.gitlab-ci.yml`

Um job conceitual:

```yaml
opengrep:
  stage: security
  image: <imagem-do-opengrep>
  script:
    - opengrep scan . --sarif > opengrep.sarif
  artifacts:
    reports:
      sarif: opengrep.sarif
    when: always
```

A estrutura:

```text
GitLab Runner
      ↓
Container OpenGrep
      ↓
Scan
      ↓
opengrep.sarif
      ↓
GitLab
      ↓
Security Findings
```

A imagem utilizada deve ser escolhida conforme a forma de distribuição suportada pela versão do OpenGrep que estiver sendo utilizada.

---

# 18. Importante: o job precisa terminar com sucesso

Existe um detalhe importante no GitLab.

Para que os findings de um relatório SARIF sejam ingeridos pelo GitLab, o job produtor precisa terminar com sucesso.

Mesmo que o artifact seja enviado quando o job falha, o GitLab não processa os findings desse relatório como findings de segurança quando o job está em estado de falha. Isso também se aplica a jobs com `allow_failure: true`.

Portanto:

```text
OpenGrep
   ↓
SARIF
   ↓
Job SUCCESS
   ↓
GitLab ingere findings
```

Mas:

```text
OpenGrep
   ↓
Job FAILED
   ↓
Artifact disponível
   ↓
❌ Findings não são ingeridos
```

Esse comportamento deve ser considerado ao configurar a política de falha do scanner.

---

# 19. Como bloquear a pipeline?

Existem duas preocupações diferentes:

```text
1. Gerar findings
2. Fazer a pipeline falhar
```

Não são necessariamente a mesma coisa.

Podemos ter:

```text
OpenGrep
   ↓
Encontrou vulnerabilidade
   ↓
Gera SARIF
   ↓
Job continua
   ↓
GitLab ingere findings
```

Ou podemos configurar o comando/política do scanner para retornar um código de saída que faça o job falhar.

Nesse segundo caso:

```text
OpenGrep
   ↓
Finding crítico
   ↓
Exit Code ≠ 0
   ↓
Job FAILED
```

Porém, conforme explicado anteriormente, um job falho não terá seus findings SARIF ingeridos pelo GitLab.

Por isso, quando o objetivo é **visualizar os findings no GitLab e também impedir o merge**, é necessário projetar a pipeline com cuidado, separando a geração/ingestão do relatório da política de bloqueio, ou utilizando mecanismos de segurança/políticas apropriados do GitLab.

---

# 20. Estratégia recomendada para começar

Uma abordagem simples:

```text
OpenGrep
   ↓
Executa análise
   ↓
Gera SARIF
   ↓
Job SUCCESS
   ↓
GitLab ingere findings
```

Depois:

```text
Security Policy
        ↓
Findings relevantes
        ↓
Bloqueio do Merge Request
```

Isso evita perder os findings do SARIF simplesmente porque o job do scanner terminou com código de erro.

---

# 21. Exemplo com artifact normal

Se o objetivo inicial for apenas guardar o relatório:

```yaml
opengrep:
  stage: security
  image: <imagem-do-opengrep>

  script:
    - opengrep scan . --sarif > opengrep.sarif

  artifacts:
    when: always
    paths:
      - opengrep.sarif
```

Fluxo:

```text
OpenGrep
   ↓
SARIF
   ↓
GitLab Artifact
```

---

# 22. Exemplo integrado ao GitLab Security

Quando o projeto possui suporte à ingestão SARIF:

```yaml
opengrep:
  stage: security
  image: <imagem-do-opengrep>

  script:
    - opengrep scan . --sarif > opengrep.sarif

  artifacts:
    reports:
      sarif: opengrep.sarif
```

O GitLab documenta `artifacts:reports:sarif` especificamente para scanners de terceiros que produzem SARIF 2.1.0.

---

# 23. Onde aparecem os resultados?

Depois da ingestão, os resultados podem ser apresentados em:

```text
Pipeline
   │
   └── Security

Project
   │
   └── Vulnerability Report

Security
   │
   └── Dashboard

Merge Request
   │
   └── Security Widget
```

O GitLab documenta esses pontos de integração para relatórios SARIF.

---

# 24. Regras customizadas no projeto

Podemos criar:

```text
.opengrep/
    rules/
        java-security.yml
        javascript-security.yml
        python-security.yml
```

Por exemplo:

```yaml
rules:
  - id: insecure-example
    pattern: someDangerousFunction(...)
    message: "Uso potencialmente inseguro"
    languages:
      - javascript
    severity: ERROR
```

E executar o scanner utilizando essas regras.

Conceitualmente:

```text
Projeto
   │
   ├── Código
   │
   └── Regras customizadas
             │
             ▼
          OpenGrep
             │
             ▼
          Findings
```

Essa abordagem permite criar regras específicas para padrões internos da organização.

---

# 25. OpenGrep em um projeto Java/Spring Boot

Imagine:

```text
backend/
│
├── src/
│   ├── main/
│   │   └── java/
│   └── test/
│
├── pom.xml
├── Dockerfile
└── .gitlab-ci.yml
```

Podemos ter:

```text
                 Pipeline
                    │
                    ▼
                 OpenGrep
                    │
                    ▼
              Código Java
                    │
                    ▼
             Security Rules
                    │
                    ▼
                Findings
```

Isso complementa o SonarQube:

```text
Java/Spring Boot
       │
       ├───────────────┐
       │               │
       ▼               ▼
   SonarQube        OpenGrep
       │               │
       ▼               ▼
 Qualidade +        Security
 Segurança          Analysis
```

---

# 26. OpenGrep + Gitleaks + SonarQube + Trivy + ZAP

Agora podemos adicionar o OpenGrep às ferramentas estudadas.

```text
                         GitLab
                            │
                            ▼
                         Git Push
                            │
                            ▼
                    ┌───────────────┐
                    │   Gitleaks    │
                    │    Secrets    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   OpenGrep    │
                    │     SAST      │
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
                          Build
                            │
                            ▼
                    ┌───────────────┐
                    │     Trivy     │
                    │ Image/Deps    │
                    └───────┬───────┘
                            │
                            ▼
                       Deploy Test
                            │
                            ▼
                    ┌───────────────┐
                    │   OWASP ZAP   │
                    │     DAST      │
                    └───────┬───────┘
                            │
                            ▼
                          Deploy
```

---

# 27. Responsabilidade de cada ferramenta

| Ferramenta | Principal objetivo |
|---|---|
| Gitleaks | Detectar secrets |
| OpenGrep | SAST / segurança do código |
| SonarQube | Qualidade + segurança do código |
| Trivy | Vulnerabilidades em imagens, dependências e configurações |
| OWASP ZAP | DAST / segurança da aplicação em execução |

Uma forma simples de lembrar:

```text
Gitleaks
   → "Tem segredo exposto?"

OpenGrep
   → "Existe um padrão inseguro no código?"

SonarQube
   → "O código possui problemas de qualidade ou segurança?"

Trivy
   → "A imagem/dependência possui vulnerabilidades?"

OWASP ZAP
   → "A aplicação executando apresenta vulnerabilidades?"
```

---

# 28. Pipeline completa

Uma possível organização:

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

opengrep:
  stage: security
  image: <imagem-do-opengrep>
  script:
    - opengrep scan . --sarif > opengrep.sarif
  artifacts:
    reports:
      sarif: opengrep.sarif

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
    - echo "Scan da imagem"

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

Essa é uma estrutura conceitual. A imagem e os comandos específicos do OpenGrep devem ser ajustados à versão/distribuição que o projeto escolher.

---

# 29. Fluxo completo de segurança

Podemos pensar na pipeline como várias camadas:

```text
                 Código
                   │
                   ▼
              ┌─────────┐
              │ Gitleaks│
              └────┬────┘
                   │
                   ▼
              ┌─────────┐
              │OpenGrep │
              └────┬────┘
                   │
                   ▼
              ┌─────────┐
              │SonarQube│
              └────┬────┘
                   │
                   ▼
                  Build
                   │
                   ▼
              ┌─────────┐
              │  Trivy  │
              └────┬────┘
                   │
                   ▼
             Aplicação
             Executando
                   │
                   ▼
              ┌─────────┐
              │   ZAP   │
              └────┬────┘
                   │
                   ▼
                 Deploy
```

Cada etapa olha para uma parte diferente do sistema.

---

# 30. OpenGrep e DevSecOps

O OpenGrep pode fazer parte de uma estratégia de **DevSecOps**.

Sem segurança integrada:

```text
Desenvolvimento
      ↓
Build
      ↓
Deploy
      ↓
Segurança depois
```

Com DevSecOps:

```text
Desenvolvimento
      ↓
Gitleaks
      ↓
OpenGrep
      ↓
Testes
      ↓
SonarQube
      ↓
Build
      ↓
Trivy
      ↓
ZAP
      ↓
Deploy
```

A segurança passa a fazer parte do processo de desenvolvimento.

---

# 31. Boas práticas

## Começar com análise informativa

Inicialmente:

```text
OpenGrep
   ↓
Gera findings
   ↓
Equipe avalia
```

Depois:

```text
Regras importantes
       ↓
Política de bloqueio
       ↓
Pipeline FAIL
```

Isso evita bloquear o desenvolvimento por uma grande quantidade de falsos positivos ou regras ainda não calibradas.

---

## Utilizar regras versionadas

As regras customizadas podem ficar no próprio repositório:

```text
.opengrep/
    rules/
```

Assim:

```text
Código
 +
Regras
 =
Versão controlada
```

---

## Utilizar SARIF

Quando o objetivo é integrar os resultados ao GitLab:

```text
OpenGrep
   ↓
SARIF 2.1.0
   ↓
GitLab Security
```

O GitLab oferece suporte à ingestão de SARIF 2.1.0 para scanners de terceiros.

---

## Não substituir todas as ferramentas

OpenGrep não precisa substituir:

```text
Gitleaks
SonarQube
Trivy
OWASP ZAP
```

Cada uma possui uma finalidade diferente.

---

# 32. Resumo

| Item | OpenGrep |
|---|---|
| Open Source | ✅ |
| SAST | ✅ |
| Análise estática | ✅ |
| Análise de segurança | ✅ |
| Regras customizadas | ✅ |
| Compatibilidade com regras Semgrep | ✅ |
| Taint Tracking | ✅ |
| JSON | ✅ |
| SARIF | ✅ |
| GitLab CI/CD | ✅ |
| GitLab Security via SARIF | ✅* |
| Precisa executar a aplicação | ❌ |
| DAST | ❌ |

\* A ingestão direta de SARIF no GitLab requer suporte à funcionalidade `artifacts:reports:sarif`; na documentação atual do GitLab, ela está disponível no tier Ultimate e aceita SARIF 2.1.0.

---

# 33. Conceito principal

O OpenGrep pode ser entendido como uma ferramenta de **SAST focada em encontrar problemas de segurança no código através de regras de análise estática**.

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
OpenGrep
    │
    ▼
Análise estática
    │
    ├── Problemas encontrados
    │          ↓
    │       SARIF
    │          ↓
    │       GitLab
    │
    └── Nenhum problema relevante
               ↓
             Pipeline
```

Quando combinado com as ferramentas anteriores:

```text
Gitleaks
   → Secrets

OpenGrep
   → SAST

SonarQube
   → Code Quality + Security

Trivy
   → Vulnerabilidades de imagens/dependências

OWASP ZAP
   → DAST
```

Isso cria uma estratégia de segurança em múltiplas camadas dentro da pipeline do GitLab.

---

# 34. Documentação

OpenGrep:

```text
https://github.com/opengrep/opengrep
```

OpenGrep Wiki:

```text
https://github.com/opengrep/opengrep/wiki
```

GitLab — SARIF Reports:

```text
https://docs.gitlab.com/user/application_security/detect/sarif/
```

GitLab — CI/CD Artifacts Reports:

```text
https://docs.gitlab.com/ci/yaml/artifacts_reports/
```

GitLab — Security Scanning:

```text
https://docs.gitlab.com/user/application_security/
```
