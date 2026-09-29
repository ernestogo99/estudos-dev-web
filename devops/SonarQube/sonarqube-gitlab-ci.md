# SonarQube

## 1. O que é o SonarQube?

O **SonarQube** é uma plataforma utilizada para realizar análise automática da **qualidade e segurança do código-fonte**.

Ele analisa o código e procura problemas como:

- Bugs;
- Vulnerabilidades de segurança;
- Code Smells;
- Código duplicado;
- Problemas de manutenção;
- Problemas de qualidade;
- Cobertura de testes;
- Complexidade do código.

Documentação:

```text
https://docs.sonarsource.com/sonarqube-server/
```

Videos de apoio:

```
https://www.youtube.com/watch?v=HSFHgti6nXg
```

```
https://www.youtube.com/watch?v=7-P81EKq-r8
```

A ideia principal é permitir que problemas sejam encontrados **durante o desenvolvimento**, antes que o código chegue ao ambiente de produção.

---

# 2. Por que utilizar o SonarQube?

Imagine que um desenvolvedor implemente:

```java
public void processUser(User user) {

    if (user != null) {

        if (user.getName() != null) {

            if (!user.getName().isEmpty()) {

                // processamento

            }

        }

    }
}
```

O código pode funcionar, mas pode apresentar problemas de legibilidade e manutenção.

O SonarQube pode identificar padrões problemáticos e apresentar sugestões para melhorar o código.

A ideia é:

```text
Código
   ↓
SonarQube
   ↓
Análise
   ↓
Problemas encontrados?
   ├── SIM → Desenvolvedor corrige
   └── NÃO → Código continua
```

---

# 3. O que o SonarQube analisa?

O SonarQube possui diferentes tipos de análise.

## 3.1. Bugs

São problemas no código que podem fazer com que o software apresente um comportamento incorreto.

Exemplo:

```java
if (user.getName().equals(null)) {
    ...
}
```

Esse tipo de construção pode indicar um problema lógico.

O SonarQube pode identificar determinados padrões que possuem alta probabilidade de gerar bugs.

---

## 3.2. Vulnerabilidades

O SonarQube também procura problemas relacionados à segurança.

Por exemplo:

```java
String query =
    "SELECT * FROM users WHERE name = '" + name + "'";
```

Dependendo do contexto, esse código pode permitir **SQL Injection**.

Uma abordagem mais segura seria utilizar parâmetros:

```java
String query =
    "SELECT * FROM users WHERE name = ?";
```

O SonarQube possui regras para detectar diversas categorias de problemas de segurança.

---

## 3.3. Code Smells

Um **Code Smell** é um padrão no código que pode indicar um problema de design, manutenção ou legibilidade.

Por exemplo:

```java
public void process(
    String name,
    String email,
    String phone,
    String address,
    String city,
    String state,
    String country,
    String zipCode
) {
    ...
}
```

Uma quantidade excessiva de parâmetros pode indicar que o método está assumindo responsabilidades demais ou que os dados poderiam ser agrupados.

O SonarQube pode identificar esse tipo de situação.

---

# 4. O que são Code Smells?

Code Smells não significam necessariamente que o código está quebrado.

Por exemplo:

```java
public void calculate() {

    // 200 linhas de código

}
```

O método pode funcionar perfeitamente.

Porém, um método muito grande pode ser mais difícil de:

- entender;
- testar;
- modificar;
- reutilizar;
- manter.

O SonarQube pode apontar esse tipo de situação.

Portanto:

```text
Bug
 ↓
Problema funcional

Vulnerability
 ↓
Problema de segurança

Code Smell
 ↓
Problema de qualidade/manutenção
```

---

# 5. Duplicação de código

O SonarQube também consegue identificar código duplicado.

Por exemplo:

```java
public void createUser() {

    validateName();
    validateEmail();
    validatePassword();

}
```

e:

```java
public void updateUser() {

    validateName();
    validateEmail();
    validatePassword();

}
```

Dependendo do tamanho e da estrutura, pode existir uma quantidade relevante de código duplicado.

A duplicação pode dificultar a manutenção.

Imagine:

```text
Código duplicado
       │
       ├── Arquivo A
       │
       └── Arquivo B
```

Se uma regra precisar ser modificada, pode ser necessário alterar os dois lugares.

---

# 6. Complexidade

O SonarQube também analisa características relacionadas à complexidade do código.

Por exemplo:

```java
if (condition1) {

    if (condition2) {

        if (condition3) {

            if (condition4) {

                // ...

            }

        }

    }

}
```

Quanto mais caminhos de execução um código possui, mais difícil pode ser testá-lo e mantê-lo.

Uma das métricas utilizadas nesse contexto é a **complexidade ciclomática**.

De forma simplificada:

```text
Mais decisões
      ↓
Mais caminhos
      ↓
Mais testes necessários
      ↓
Maior complexidade
```

---

# 7. Cobertura de testes

O SonarQube também consegue apresentar informações relacionadas à cobertura de testes.

Por exemplo:

```text
Código total:       1000 linhas
Linhas testadas:    800
Cobertura:           80%
```

Uma visualização conceitual:

```text
                  Testes

                   80%
              ████████████████░░░░

             Cobertura de código
```

### Importante

O SonarQube **não cria os testes automaticamente**.

Ele utiliza os relatórios produzidos pelas ferramentas de testes e apresenta essas informações na análise.

Por exemplo, em um projeto Spring Boot:

```text
JUnit
   ↓
Executa testes
   ↓
Gera relatório de cobertura
   ↓
SonarQube
   ↓
Apresenta cobertura
```

---

# 8. Quality Gate

Um dos conceitos mais importantes do SonarQube é o **Quality Gate**.

O Quality Gate funciona como uma espécie de **critério de aprovação da qualidade do código**.

Podemos imaginar:

```text
              SonarQube
                  │
                  ▼
             Quality Gate
                  │
          ┌───────┴───────┐
          │               │
        PASS             FAIL
          │               │
          ▼               ▼
       Pipeline         Pipeline
       continua           para
```

Por exemplo, um projeto pode estabelecer critérios como:

```text
Coverage >= 80%

New Bugs = 0

New Vulnerabilities = 0

Duplicated Lines <= determinado limite
```

Os critérios concretos dependem do Quality Gate configurado no SonarQube.

---

# 9. SonarQube no GitLab CI/CD

O SonarQube pode ser integrado diretamente ao GitLab CI/CD.

O GitLab utiliza o arquivo:

```text
.gitlab-ci.yml
```

para definir os jobs e stages da pipeline.

Podemos adicionar uma etapa:

```text
Git Push
    ↓
GitLab CI/CD
    ↓
Tests
    ↓
SonarQube
    ↓
Quality Gate
    ↓
Build
    ↓
Deploy
```

---

# 10. SonarQube + projeto Spring Boot

Como exemplo, considere:

```text
spring-backend/
│
├── src/
│   ├── main/
│   └── test/
│
├── pom.xml
├── Dockerfile
└── .gitlab-ci.yml
```

O SonarQube possui um **SonarScanner for Maven**, utilizado para analisar projetos Maven.

Podemos executar:

```bash
mvn org.sonarsource.scanner.maven:sonar-maven-plugin:sonar
```

---

# 11. Configurando o SonarQube

Primeiramente, é necessário possuir uma instância do SonarQube.

Pode ser:

```text
SonarQube Server
```

ou uma solução hospedada da própria Sonar.

Depois, criamos um projeto no SonarQube.

Por exemplo:

```text
Project Name:
SEPLAG Backend

Project Key:
seplag-backend
```

O projeto terá uma chave que será utilizada durante a análise.

---

# 12. Criando um token

Para que o GitLab consiga enviar a análise para o SonarQube, precisamos configurar autenticação.

Podemos utilizar um token:

```text
SONAR_TOKEN
```

O valor desse token **não deve ser colocado diretamente no `.gitlab-ci.yml`**.

Em vez disso, devemos utilizar as **CI/CD Variables do GitLab**.

Por exemplo:

```text
Settings
   ↓
CI/CD
   ↓
Variables
   ↓
Add variable
```

Criamos:

```text
Key:
SONAR_TOKEN

Value:
<token-do-sonarqube>
```

Dessa maneira, o token não fica armazenado diretamente no repositório.

---

# 13. Configurando o endereço do SonarQube

Também precisamos informar onde o SonarQube está executando.

Por exemplo:

```text
SONAR_HOST_URL

https://sonarqube.exemplo.com
```

No GitLab:

```text
Settings
   ↓
CI/CD
   ↓
Variables
   ↓
SONAR_HOST_URL
```

Assim:

```text
GitLab
   │
   ├── SONAR_TOKEN
   │
   └── SONAR_HOST_URL
            │
            ▼
        SonarQube
```

---

# 14. Criando o job do SonarQube

Para um projeto Maven, podemos utilizar:

```yaml
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
    - mvn org.sonarsource.scanner.maven:sonar-maven-plugin:sonar
```

O `GIT_DEPTH: "0"` permite que o scanner tenha acesso ao histórico completo do Git.

---

# 15. Esperando o Quality Gate

Podemos fazer o scanner aguardar o resultado do Quality Gate.

Para isso:

```bash
-Dsonar.qualitygate.wait=true
```

Exemplo:

```yaml
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

  allow_failure: false
```

Quando o Quality Gate falha, o job pode falhar e impedir que a pipeline avance.

Fluxo:

```text
SonarQube
    ↓
Quality Gate
    ↓
┌───────────────┐
│     PASS?     │
└───────┬───────┘
        │
   ┌────┴────┐
   │         │
  SIM       NÃO
   │         │
   ▼         ▼
 Build     ❌ STOP
```

---

# 16. Fluxo da pipeline

Podemos ter:

```text
                    GitLab
                       │
                       ▼
                     Tests
                       │
                       ▼
                   SonarQube
                       │
                       ▼
                  Code Analysis
                       │
                       ▼
                 Quality Gate
                       │
              ┌────────┴────────┐
              │                 │
             PASS              FAIL
              │                 │
              ▼                 ▼
             Build          ❌ STOP
              │
              ▼
            Trivy
              │
              ▼
            Deploy
```

Nesse cenário, o SonarQube funciona como uma **barreira de qualidade**.

---

# 17. Exemplo completo para Spring Boot

Uma pipeline pode ficar assim:

```yaml
stages:
  - security
  - test
  - quality
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

  allow_failure: false

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
    - echo "Análise de segurança da imagem"

deploy:
  stage: deploy
  script:
    - echo "Deploy da aplicação"
```

A estrutura seria:

```text
                    Git Push
                       │
                       ▼
                   Gitleaks
                       │
                       ▼
                     Tests
                       │
                       ▼
                   SonarQube
                       │
                       ▼
                 Quality Gate
                       │
                       ▼
                    Build
                       │
                       ▼
                    Trivy
                       │
                       ▼
                    Deploy
```

---

# 18. SonarQube + Gitleaks + Trivy

As três ferramentas possuem responsabilidades diferentes.

```text
                 GitLab CI/CD
                      │
          ┌───────────┼────────────┐
          │           │            │
          ▼           ▼            ▼
      Gitleaks    SonarQube      Trivy
          │           │            │
          ▼           ▼            ▼
       Secrets      Código      Imagem
                    Quality
          │           │            │
          └───────────┼────────────┘
                      ▼
                 Security /
                 Quality Gate
                      │
                      ▼
                    Deploy
```

### Gitleaks

Principal objetivo:

```text
Detectar secrets expostos
```

Exemplos:

```text
API Keys
Tokens
Senhas
Private Keys
```

### SonarQube

Principal objetivo:

```text
Analisar qualidade e segurança do código
```

Exemplos:

```text
Bugs
Vulnerabilidades
Code Smells
Duplicação
Complexidade
Cobertura
```

### Trivy

Principal objetivo:

```text
Analisar vulnerabilidades e configurações
```

Exemplos:

```text
Docker Images
Dependências
Secrets
IaC
Misconfigurations
```

---

# 19. Diferença entre SonarQube e Trivy

É importante não confundir as duas ferramentas.

```text
Código-fonte
     │
     ▼
  SonarQube
     │
     ├── Bugs
     ├── Code Smells
     ├── Vulnerabilidades
     ├── Duplicação
     └── Cobertura
```

Enquanto:

```text
Docker Image
     │
     ▼
   Trivy
     │
     ├── CVEs
     ├── Pacotes vulneráveis
     ├── Secrets
     ├── Misconfigurations
     └── IaC
```

De maneira simplificada:

| Ferramenta | Principal foco                            |
| ---------- | ----------------------------------------- |
| Gitleaks   | Secrets                                   |
| SonarQube  | Qualidade e segurança do código           |
| Trivy      | Vulnerabilidades e segurança de artefatos |

Elas podem ser utilizadas de maneira complementar.

---

# 20. SonarQube e cobertura de testes

Podemos combinar:

```text
JUnit
   ↓
Testes
   ↓
JaCoCo
   ↓
Relatório de cobertura
   ↓
SonarQube
```

Por exemplo:

```text
Coverage

80%
████████████████░░░░
```

O SonarQube pode utilizar informações de cobertura fornecidas pelos testes e pelos mecanismos de cobertura configurados no projeto.

Assim, podemos estabelecer um Quality Gate relacionado à cobertura.

---

# 21. SonarQube e Merge Requests

O SonarQube pode ser integrado ao GitLab para análise de projetos e, em edições que oferecem essa funcionalidade, apresentar informações de qualidade e Quality Gate nas Merge Requests.

O fluxo pode ser:

```text
Developer
    │
    ▼
Feature Branch
    │
    ▼
Merge Request
    │
    ▼
GitLab Pipeline
    │
    ▼
SonarQube
    │
    ▼
Quality Gate
    │
    ├── FAIL → Corrigir código
    │
    └── PASS → Processo de merge continua
```

Isso permite que a análise aconteça antes da integração da alteração na branch principal.

---

# 22. SonarQube como Quality Gate da pipeline

Uma aplicação pode estabelecer uma política como:

```text
                    Quality Gate
                         │
        ┌────────────────┼────────────────┐
        │                │                │
      Bugs        Vulnerabilities     Coverage
        │                │                │
        ▼                ▼                ▼
      OK?              OK?              OK?
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                      Resultado
```

Se o Quality Gate for aprovado:

```text
SonarQube
    ↓
PASS
    ↓
Build
    ↓
Trivy
    ↓
Deploy
```

Se falhar:

```text
SonarQube
    ↓
FAIL
    ↓
❌ Pipeline interrompida
```

---

# 23. Configuração do `sonar-project.properties`

Também é possível armazenar configurações do projeto em:

```text
sonar-project.properties
```

Por exemplo:

```properties
sonar.projectKey=seplag-backend
sonar.projectName=SEPLAG Backend
sonar.sources=src/main/java
sonar.tests=src/test/java
```

Porém, para um projeto Maven, o **SonarScanner for Maven** normalmente é uma opção mais natural, pois o Maven já fornece ao scanner diversas informações necessárias para a análise.

---

# 24. Variáveis importantes

Podemos ter no GitLab:

```text
SONAR_HOST_URL
SONAR_TOKEN
```

Por exemplo:

```text
SONAR_HOST_URL
↓
https://sonarqube.exemplo.com
```

e:

```text
SONAR_TOKEN
↓
****************
```

Essas informações não devem ficar diretamente no código.

O `.gitlab-ci.yml` apenas referencia:

```yaml
-Dsonar.host.url=$SONAR_HOST_URL
-Dsonar.token=$SONAR_TOKEN
```

---

# 25. Cache do SonarQube

A pipeline pode utilizar cache:

```yaml
variables:
  SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"

cache:
  key: "${CI_JOB_NAME}"
  paths:
    - .sonar/cache
```

Isso permite reaproveitar arquivos utilizados pelo scanner entre execuções.

---

# 26. Não permitir que o SonarQube seja ignorado

Uma configuração importante é:

```yaml
allow_failure: false
```

Assim, caso o job falhe:

```text
SonarQube
    ↓
FAIL
    ↓
Job FAILED
    ↓
Pipeline para
```

Em uma pipeline de produção, isso permite utilizar o SonarQube como **quality gate obrigatório**.

---

# 27. Boas práticas

### Executar o SonarQube durante a pipeline

Em vez de depender de uma análise manual:

```text
Developer
   ↓
Git Push
   ↓
GitLab
   ↓
SonarQube
```

a análise acontece automaticamente.

---

### Não armazenar o token no repositório

Evite:

```yaml
SONAR_TOKEN: "abc123..."
```

Prefira:

```text
GitLab CI/CD Variables
```

e:

```yaml
$SONAR_TOKEN
```

---

### Utilizar Quality Gates

Não basta gerar um relatório.

É possível utilizar o resultado para estabelecer critérios de qualidade:

```text
Código
  ↓
SonarQube
  ↓
Quality Gate
  ↓
PASS / FAIL
```

---

### Executar depois dos testes

Uma organização comum é:

```text
Testes
   ↓
SonarQube
   ↓
Quality Gate
   ↓
Build
```

Assim, o SonarQube pode utilizar informações produzidas durante os testes, como cobertura.

---

### Utilizar `GIT_DEPTH: "0"`

Para análises completas no GitLab CI/CD:

```yaml
variables:
  GIT_DEPTH: "0"
```

Isso permite ao scanner acessar o histórico Git necessário para a análise.

---

# 28. Exemplo de arquitetura completa

Considerando as ferramentas:

```text
                         GitLab
                            │
                            ▼
                      Git Push / MR
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
                      ┌─────┴─────┐
                      │           │
                     FAIL        PASS
                      │           │
                      ▼           ▼
                  ❌ STOP       Build
                                  │
                                  ▼
                            Docker Image
                                  │
                                  ▼
                           ┌────────────┐
                           │   Trivy    │
                           │ Security   │
                           └─────┬──────┘
                                 │
                                 ▼
                               Deploy
```

Essa arquitetura cria diferentes barreiras:

```text
Gitleaks
   ↓
Secrets

SonarQube
   ↓
Qualidade + Segurança do código

Trivy
   ↓
Segurança da imagem/artefato

Deploy
   ↓
Somente depois das verificações
```

---

# 29. Resumo

| Item                                     | SonarQube |
| ---------------------------------------- | --------- |
| Análise de código                        | ✅        |
| Bugs                                     | ✅        |
| Vulnerabilidades                         | ✅        |
| Code Smells                              | ✅        |
| Código duplicado                         | ✅        |
| Complexidade                             | ✅        |
| Cobertura de testes                      | ✅        |
| Quality Gate                             | ✅        |
| Integração com GitLab CI/CD              | ✅        |
| Pode interromper pipeline                | ✅        |
| Analisa Docker Image como foco principal | ❌        |
| Substitui Trivy                          | ❌        |
| Substitui Gitleaks                       | ❌        |
| Substitui testes automatizados           | ❌        |

## Conceito principal

O SonarQube funciona como uma **barreira de qualidade e segurança do código dentro do processo de desenvolvimento**.

```text
Developer
    │
    ▼
Git Commit
    │
    ▼
GitLab CI/CD
    │
    ▼
Tests
    │
    ▼
SonarQube
    │
    ▼
Quality Gate
    │
    ├── ❌ FAIL → Pipeline para
    │
    └── ✅ PASS
            │
            ▼
          Build
            │
            ▼
          Trivy
            │
            ▼
          Deploy
```

O ponto mais importante é diferenciar as responsabilidades:

```text
Gitleaks
   → Detecta secrets

SonarQube
   → Analisa qualidade e segurança do código

Trivy
   → Analisa vulnerabilidades e segurança de imagens/artefatos
```

Dessa forma, as três ferramentas podem trabalhar juntas dentro da mesma pipeline do GitLab.

---

# 30. Documentação

Documentação oficial do SonarQube:

```text
https://docs.sonarsource.com/sonarqube-server/
```

SonarScanner for Maven:

```text
https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/scanners/sonarscanner-for-maven
```

Integração SonarQube + GitLab CI/CD:

```text
https://docs.sonarsource.com/sonarqube-server/2025.6/devops-platform-integration/gitlab-integration/adding-analysis-to-gitlab-ci-cd
```

GitLab CI/CD:

```text
https://docs.gitlab.com/ci/
```
