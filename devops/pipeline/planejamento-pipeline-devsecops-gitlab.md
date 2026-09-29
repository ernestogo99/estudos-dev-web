# Planejamento da Pipeline DevSecOps — GitLab CI/CD

## 1. Objetivo

Este documento propõe uma evolução da pipeline atual do backend para incorporar as ferramentas de segurança discutidas:

- **Gitleaks CLI** — detecção de secrets;
- **OpenGrep** — análise estática de segurança (SAST);
- **SonarQube** — qualidade de código e análise de segurança;
- **Trivy** — vulnerabilidades em dependências, filesystem, imagem e configurações;
- **OWASP ZAP** — análise dinâmica de segurança (DAST).

O objetivo não é simplesmente adicionar ferramentas à pipeline, mas organizar as etapas para:

- evitar análises repetidas;
- executar verificações independentes em paralelo quando possível;
- impedir que ferramentas pesadas sejam executadas desnecessariamente;
- aproveitar cache e artifacts;
- separar análise de código, análise do artefato e análise da aplicação em execução;
- estabelecer progressivamente quais verificações bloqueiam o deploy;
- manter feedback rápido para o desenvolvedor.

---

# 2. Pipeline atual

Atualmente, a pipeline possui três stages principais:

```text
test
  ↓
push
  ↓
deploy
```

Dentro de `test`, existem atualmente:

```text
SonarQube
GitLab SAST
Testes Maven
Checkstyle
Gitleaks
Trivy
```

Depois:

```text
push
  ↓
Docker build
  ↓
Docker Slim
  ↓
Docker Hub
```

E finalmente:

```text
deploy
  ↓
Staging / Produção
```

---

# 3. Problemas da estrutura atual

A pipeline atual funciona, mas existem alguns pontos que podem ser melhorados.

## 3.1 Muitas verificações no mesmo stage

Atualmente praticamente tudo está em:

```yaml
stage: test
```

Isso dificulta visualizar a função de cada etapa.

Uma organização mais clara seria:

```text
security
test
quality
build
container-security
deploy-test
dast
deploy
```

Isso não significa necessariamente que a pipeline ficará mais lenta.

O GitLab executa jobs independentes do mesmo stage em paralelo, desde que não existam dependências entre eles.

---

# 4. Maior problema: redundância

Atualmente temos:

```text
GitLab SAST
     +
SonarQube
     +
Gitleaks
     +
Trivy
```

O problema não é ter várias ferramentas.

O problema é executar análises que cobrem exatamente a mesma superfície sem uma estratégia clara.

Por exemplo:

```text
Código
  │
  ├── GitLab SAST
  ├── SonarQube
  └── OpenGrep
```

Existe sobreposição entre SAST, SonarQube e OpenGrep.

Por isso, a proposta será:

```text
Gitleaks
    → Secrets

OpenGrep
    → SAST focado em segurança

SonarQube
    → Qualidade + análise complementar

Trivy
    → Dependências / filesystem / imagem / configuração

OWASP ZAP
    → DAST
```

---

# 5. Arquitetura proposta

A pipeline planejada será:

```text
                         GitLab
                           │
                     Push / Merge Request
                           │
                           ▼
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
         Gitleaks       OpenGrep      SonarQube
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                         Tests
                           │
                           ▼
                         Build
                           │
                           ▼
                        Trivy
                           │
                           ▼
                     Deploy Staging
                           │
                           ▼
                         OWASP ZAP
                           │
                           ▼
                         Deploy
```

Porém, essa representação é conceitual.

Na prática, algumas etapas devem executar em paralelo.

---

# 6. Estratégia principal: pipeline rápida + pipeline completa

Uma boa estratégia é diferenciar o que precisa acontecer em cada alteração e o que pode ser executado depois.

## Merge Request

Executar:

```text
Gitleaks
OpenGrep
SonarQube
Testes
```

Essas verificações fornecem feedback rápido sobre o código.

---

## Branch `develop`

Executar:

```text
Gitleaks
OpenGrep
SonarQube
Testes
Build
Trivy
Deploy Staging
ZAP
```

---

## Branch `main`

Executar as verificações necessárias para produção:

```text
Gitleaks
OpenGrep
SonarQube
Testes
Build
Trivy
Deploy Produção
```

O ZAP pode continuar sendo executado no ambiente de staging antes da promoção para produção.

---

# 7. Por que não executar ZAP em cada alteração?

O ZAP é diferente das outras ferramentas.

Ele precisa de uma aplicação executando:

```text
Código
   ↓
Build
   ↓
Deploy Test
   ↓
Aplicação
   ↓
ZAP
```

Enquanto:

```text
Gitleaks
OpenGrep
SonarQube
```

podem analisar o código antes de a aplicação ser disponibilizada.

Por isso, colocar ZAP no início da pipeline criaria dependências desnecessárias.

---

# 8. Organização dos stages

Uma sugestão:

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
```

A função de cada stage:

| Stage | Objetivo |
|---|---|
| `security` | Gitleaks e OpenGrep |
| `test` | Testes automatizados |
| `quality` | SonarQube / Checkstyle |
| `build` | Construção da imagem |
| `container-security` | Trivy |
| `deploy-test` | Deploy em staging |
| `dast` | OWASP ZAP |
| `deploy` | Deploy final |

---

# 9. Paralelismo

Não é necessário executar:

```text
Gitleaks
   ↓
OpenGrep
   ↓
SonarQube
```

sequencialmente.

Eles analisam o código de maneiras diferentes e, em princípio, podem executar em paralelo.

A estrutura pode ser:

```text
                   Git Push
                      │
           ┌──────────┼──────────┐
           │          │          │
           ▼          ▼          ▼
       Gitleaks    OpenGrep   SonarQube
           │          │          │
           └──────────┼──────────┘
                      ▼
                    Tests
```

Isso reduz o tempo total da pipeline.

---

# 10. Gitleaks

## Responsabilidade

O Gitleaks deve responder:

```text
Existe algum secret exposto no repositório?
```

Exemplos:

```text
API keys
Passwords
Tokens
Private keys
Credentials
```

Job:

```yaml
gitleaks:
  stage: security
  image:
    name: zricethezav/gitleaks:<VERSAO_FIXADA>
    entrypoint: [""]
  script:
    - gitleaks detect --source . --verbose
```

## Política

O Gitleaks deve ser tratado como uma barreira importante.

A recomendação é:

```text
Secret real encontrado
        ↓
Pipeline FAIL
```

Durante a implantação inicial, `allow_failure: true` pode ser usado temporariamente para avaliar falsos positivos.

Depois:

```yaml
allow_failure: false
```

---

# 11. OpenGrep

## Responsabilidade

O OpenGrep será responsável pela análise estática focada em segurança.

```text
Código
  ↓
OpenGrep
  ↓
Security Findings
```

O OpenGrep suporta múltiplas linguagens, incluindo Java, JavaScript, Python, TypeScript, Dockerfile, Terraform e outras.

Documentação:

```text
https://github.com/opengrep/opengrep
```

## Relatório

Quando possível, gerar:

```text
SARIF
```

e disponibilizar ao GitLab.

Conceitualmente:

```yaml
opengrep:
  stage: security
  script:
    - <executar OpenGrep>
    - <gerar opengrep.sarif>
  artifacts:
    reports:
      sarif: opengrep.sarif
```

O comando e a imagem devem ser fixados em uma versão conhecida do OpenGrep, em vez de utilizar uma tag mutável como `latest`.

---

# 12. SonarQube

O SonarQube continuará sendo utilizado porque ele cobre uma área mais ampla:

```text
Bugs
Code Smells
Vulnerabilidades
Duplicação
Complexidade
Cobertura
Quality Gate
```

## Problema atual

Atualmente:

```yaml
allow_failure: true
```

Isso significa que uma falha do SonarQube não impede a continuação da pipeline.

Além disso, o comando atual não está aguardando explicitamente o Quality Gate.

A documentação do SonarQube indica:

```text
sonar.qualitygate.wait=true
```

para fazer o scanner aguardar o resultado do Quality Gate e permitir que a pipeline falhe quando o Quality Gate falhar.

Documentação:

```text
https://docs.sonarsource.com/sonarqube-server/latest/devops-platform-integration/gitlab-integration/adding-analysis-to-gitlab-ci-cd/
```

---

# 13. Estratégia para o SonarQube

Inicialmente:

```text
SonarQube
   ↓
Quality Gate
   ↓
Relatório
```

Depois de estabilizar a configuração:

```text
Quality Gate FAIL
       ↓
Pipeline FAIL
```

A configuração pode ser:

```yaml
sonarqube:
  stage: quality
  script:
    - >
      mvn verify sonar:sonar
      -Dsonar.host.url="$SONAR_HOST_URL"
      -Dsonar.token="$SONAR_TOKEN"
      -Dsonar.projectKey="seplag-gsi-backend"
      -Dsonar.qualitygate.wait=true
```

O token deve permanecer em:

```text
GitLab CI/CD Variables
```

e nunca no repositório.

---

# 14. Evitar recompilação desnecessária

Atualmente temos:

```text
SonarQube
  → mvn verify

Test
  → mvn clean test
```

Isso pode significar execução repetida do Maven.

Uma melhoria é organizar os jobs para aproveitar resultados quando isso realmente reduzir tempo.

Por exemplo:

```text
Build/Test
   ↓
target/
   ↓
SonarQube
```

Entretanto, isso precisa ser avaliado de acordo com os analyzers do projeto e com o custo de transferir artifacts.

A regra prática é:

```text
Não criar artifacts grandes apenas para evitar poucos segundos de execução.

Não recompilar uma aplicação pesada sem necessidade.
```

A otimização deve ser medida pelo tempo real da pipeline.

---

# 15. Testes

O job atual:

```yaml
test:
  stage: test
  script:
    - mvn clean test -B
```

é importante e deve permanecer.

Porém, o uso de:

```text
Docker-in-Docker
```

deve ser mantido somente se os testes realmente precisarem de Docker.

Se o projeto utiliza:

```text
Testcontainers
```

por exemplo, então o Docker-in-Docker pode ser necessário.

Se não utiliza, podemos remover:

```yaml
services:
  - docker:dind
```

e reduzir complexidade e tempo de inicialização.

---

# 16. Checkstyle

O Checkstyle possui uma responsabilidade diferente:

```text
Padrões de código
```

Portanto:

```text
Checkstyle
   +
SonarQube
```

não são necessariamente redundantes.

O Checkstyle pode atuar como uma validação rápida e objetiva.

Porém, vale avaliar se as mesmas regras já estão sendo aplicadas pelo SonarQube.

Se houver duplicação significativa:

```text
Checkstyle
   ↓
Regras
   +
SonarQube
   ↓
Mesmas regras
```

podemos consolidar.

A recomendação é comparar os resultados antes de remover qualquer uma das duas.

---

# 17. Trivy

O Trivy deve ser dividido em dois momentos conceituais.

## Antes da imagem

Pode analisar:

```text
Filesystem
Dependências
IaC
Configurações
```

## Depois da imagem

Pode analisar:

```text
Docker Image
   ↓
CVEs
```

Para a pipeline proposta, o segundo cenário é especialmente importante.

```text
Build
  ↓
Docker Image
  ↓
Trivy
```

Isso garante que o artefato que será distribuído também seja analisado.

Documentação:

```text
https://trivy.dev/docs/latest/
```

---

# 18. Problema do Trivy atual

Atualmente:

```yaml
trivy fs --scanners vuln,secret,misconfig --exit-code 0 .
```

Isso significa que o comando não falha quando encontra problemas.

Além disso, ele está analisando o filesystem do projeto, não necessariamente a imagem Docker final.

A proposta é:

```text
Build da imagem
      ↓
Trivy image
      ↓
Vulnerabilidades
```

Por exemplo:

```bash
trivy image \
  --severity HIGH,CRITICAL \
  --exit-code 1 \
  "$DOCKER_IMAGE"
```

A política de severidade deve ser definida pelo projeto.

---

# 19. Não duplicar secret scanning

Aqui existe uma decisão importante.

Atualmente:

```text
Gitleaks
   +
Trivy secret scanner
```

ambos podem procurar secrets.

Isso é potencialmente redundante.

Como já temos:

```text
Gitleaks
```

como ferramenta específica de secret scanning, podemos limitar o Trivy a:

```text
vulnerabilities
misconfigurations
```

quando esse for o objetivo.

Por exemplo:

```bash
trivy fs \
  --scanners vuln,misconfig \
  .
```

E para a imagem:

```bash
trivy image \
  --scanners vuln,misconfig \
  "$DOCKER_IMAGE"
```

A configuração final deve ser definida de acordo com o que realmente queremos detectar.

---

# 20. Build da imagem

Atualmente o build ocorre somente no job de push.

Isso gera um problema arquitetural:

```text
Build
  +
Push
```

estão acoplados.

A proposta é separar:

```text
build-image
     ↓
Docker Image
     ↓
Trivy
     ↓
Push
```

Porém, existe uma questão importante:

## Como passar a imagem entre jobs?

Uma possibilidade é utilizar:

```text
GitLab Container Registry
```

ou salvar a imagem como artifact, dependendo do tamanho e da infraestrutura.

Para imagens maiores, utilizar o registry tende a ser mais apropriado do que transferir um `docker save` enorme como artifact.

---

# 21. Usar tag imutável

Evitar depender apenas de:

```text
api-prod
```

como identificador da imagem.

Preferir também:

```text
$CI_COMMIT_SHA
```

Por exemplo:

```text
seplag-gsi:<commit-sha>
```

Isso permite:

```text
Código
   ↓
Commit SHA
   ↓
Imagem
   ↓
Trivy
   ↓
Deploy
```

O mesmo artefato analisado deve ser o artefato utilizado no deploy.

---

# 22. Exemplo conceitual do build

```yaml
build-image:
  stage: build
  image: docker:28.0.1
  services:
    - docker:28.0.1-dind
  script:
    - docker build -f Dockerfile.prod -t "$IMAGE:$CI_COMMIT_SHA" .
    - docker push "$IMAGE:$CI_COMMIT_SHA"
```

Depois:

```yaml
trivy-image:
  stage: container-security
  script:
    - trivy image --severity HIGH,CRITICAL --exit-code 1 "$IMAGE:$CI_COMMIT_SHA"
```

E posteriormente:

```text
Deploy
   ↓
IMAGE:$CI_COMMIT_SHA
```

Assim garantimos rastreabilidade.

---

# 23. Docker Slim

A pipeline atual utiliza:

```text
Docker Slim
```

depois do build:

```text
Docker build
   ↓
Fat image
   ↓
Docker Slim
   ↓
Slim image
   ↓
Push
```

Isso pode continuar sendo utilizado.

Porém, é importante decidir qual imagem será analisada.

A melhor estratégia é analisar a **imagem final que realmente será implantada**.

Portanto:

```text
Docker build
      ↓
Docker Slim
      ↓
Imagem final
      ↓
Trivy
      ↓
Push / Deploy
```

ou:

```text
Docker build
      ↓
Imagem intermediária
      ↓
Trivy
      ↓
Docker Slim
      ↓
Imagem final
      ↓
Trivy novamente
```

A segunda opção aumenta o tempo.

Para uma pipeline mais rápida, podemos analisar a imagem final, desde que o processo de transformação seja confiável e faça parte do artefato de produção.

---

# 24. OWASP ZAP

O ZAP deve ficar depois do deploy de staging:

```text
Build
  ↓
Trivy
  ↓
Deploy Staging
  ↓
OWASP ZAP
```

Isso evita executar um DAST antes de a aplicação existir.

---

# 25. ZAP Baseline primeiro

Para a primeira versão:

```text
ZAP Baseline
```

é preferível a iniciar diretamente com um Active Scan agressivo.

Exemplo conceitual:

```bash
zap-baseline.py \
  -t "$DAST_TARGET_URL" \
  -r zap-report.html
```

O Baseline realiza crawling e análise passiva e é mais adequado para uma primeira integração de CI/CD.

Documentação:

```text
https://www.zaproxy.org/docs/docker/baseline-scan/
```

---

# 26. ZAP e ambiente

O ZAP não deve apontar para produção durante um Active Scan.

Preferir:

```text
Staging
Homologação
Review App
Ambiente de testes
```

Fluxo:

```text
Deploy Staging
      ↓
Application
      ↓
ZAP
      ↓
DAST
```

---

# 27. Política do ZAP

Inicialmente:

```text
ZAP
 ↓
Relatório
 ↓
Avaliação
```

Depois:

```text
Vulnerabilidade acima da política
            ↓
        Pipeline FAIL
```

Isso evita bloquear o desenvolvimento por findings que ainda não foram classificados.

---

# 28. Regras de execução

A pipeline deve utilizar `rules` para evitar executar tudo em todas as branches.

Por exemplo:

```yaml
rules:
  - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
  - if: '$CI_COMMIT_BRANCH == "develop"'
  - if: '$CI_COMMIT_BRANCH == "main"'
```

Uma estratégia mais refinada pode separar:

```text
Merge Request
develop
main
```

Isso também evita pipelines desnecessárias.

---

# 29. Evitar pipeline duplicada

É importante tomar cuidado para não gerar:

```text
Pipeline de branch
+
Pipeline de Merge Request
```

para o mesmo push.

Podemos controlar isso com `workflow: rules`.

Exemplo conceitual:

```yaml
workflow:
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH'
```

A configuração final deve ser ajustada ao fluxo de branches utilizado pelo projeto.

---

# 30. Cache do Maven

O cache atual:

```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .m2/repository
```

é útil.

Porém, usar a branch como chave pode criar muitos caches diferentes:

```text
develop
feature-a
feature-b
feature-c
...
```

Isso reduz o reaproveitamento.

Uma alternativa é utilizar uma chave baseada no projeto e permitir fallback.

Por exemplo:

```yaml
cache:
  key:
    files:
      - pom.xml
  paths:
    - .m2/repository
```

Isso pode aumentar o reaproveitamento quando o `pom.xml` não mudou.

A escolha deve considerar o tamanho do cache e a infraestrutura dos runners.

---

# 31. Cache do SonarQube

O cache:

```yaml
.sonar/cache
```

deve continuar.

O SonarQube recomenda o uso desse diretório para cache do scanner.

Exemplo:

```yaml
variables:
  SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"

cache:
  key: "${CI_JOB_NAME}"
  paths:
    - .sonar/cache
```

Também é importante manter:

```yaml
GIT_DEPTH: "0"
```

para que a análise tenha acesso ao histórico Git necessário.

Documentação:

```text
https://docs.sonarsource.com/sonarqube-server/latest/devops-platform-integration/gitlab-integration/adding-analysis-to-gitlab-ci-cd/
```

---

# 32. Imagens Docker fixadas

Atualmente existem imagens como:

```yaml
gitleaks:latest
trivy:latest
```

Isso pode tornar a pipeline não determinística.

Hoje:

```text
latest
 ↓
versão A
```

amanhã:

```text
latest
 ↓
versão B
```

A pipeline pode mudar sem alteração no repositório.

Preferir:

```text
gitleaks:<versão>
trivy:<versão>
zaproxy:<versão>
```

ou utilizar uma política controlada de atualização.

---

# 33. Por que não usar `latest`?

Imagine:

```text
Commit A
 ↓
Trivy latest = versão 1
```

Uma semana depois:

```text
Commit A
 ↓
Trivy latest = versão 2
```

O mesmo commit pode produzir resultados diferentes simplesmente porque a ferramenta mudou.

Para uma pipeline de segurança, isso reduz a reprodutibilidade.

Por isso:

```text
Versão fixada
      ↓
Atualização deliberada
      ↓
Teste
      ↓
Merge
```

é preferível.

---

# 34. `allow_failure`

A configuração atual utiliza:

```yaml
allow_failure: true
```

em:

```text
SonarQube
Gitleaks
Trivy
```

Isso é aceitável durante a fase de implantação das ferramentas.

Mas não deve necessariamente ser permanente.

Uma estratégia gradual:

### Fase 1

```text
Scanner
  ↓
Relatório
  ↓
allow_failure: true
```

### Fase 2

```text
Scanner
  ↓
Política
  ↓
Falha em findings relevantes
```

### Fase 3

```text
Security Gate
  ↓
Bloqueia Merge/Deploy
```

---

# 35. Política sugerida

Uma política inicial poderia ser:

| Ferramenta | Inicialmente | Futuro |
|---|---|---|
| Gitleaks | Reportar | Bloquear secrets |
| OpenGrep | Reportar | Bloquear findings definidos |
| SonarQube | Reportar | Quality Gate obrigatório |
| Trivy | Reportar | Bloquear HIGH/CRITICAL conforme política |
| ZAP | Reportar | Bloquear findings acima do limite |

Isso permite amadurecer a pipeline sem criar um grande número de bloqueios imediatamente.

---

# 36. Pipeline proposta

Uma estrutura mais próxima do resultado final:

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
```

### Security

```text
Gitleaks
OpenGrep
```

### Test

```text
Maven Test
```

### Quality

```text
SonarQube
Checkstyle
```

### Build

```text
Docker Build
Docker Slim
Push da imagem versionada
```

### Container Security

```text
Trivy Image
```

### Deploy Test

```text
Staging
```

### DAST

```text
OWASP ZAP
```

### Deploy

```text
Production
```

---

# 37. Fluxo recomendado

```text
                         Git Push / MR
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
          Gitleaks          OpenGrep        SonarQube
              │                │                │
              └────────────────┼────────────────┘
                               │
                         ┌─────┴─────┐
                         │           │
                         ▼           ▼
                       Tests     Checkstyle
                         │           │
                         └─────┬─────┘
                               ▼
                          Build Image
                               │
                               ▼
                         Docker Slim
                               │
                               ▼
                         Trivy Image
                               │
                               ▼
                        Deploy Staging
                               │
                               ▼
                         OWASP ZAP
                               │
                               ▼
                       Security Gate
                               │
                    ┌──────────┴──────────┐
                    │                     │
                  FAIL                   PASS
                    │                     │
                    ▼                     ▼
                  STOP                Deploy
                                       Production
```

---

# 38. Onde a pipeline fica mais rápida?

Existem cinco otimizações principais.

## 1. Paralelismo

Executar:

```text
Gitleaks
OpenGrep
SonarQube
Checkstyle
```

em paralelo quando não houver dependência.

---

## 2. Cache

Reutilizar:

```text
.m2/repository
.sonar/cache
```

---

## 3. Não executar ZAP antes da hora

ZAP somente depois de:

```text
Deploy Staging
```

---

## 4. Não escanear secrets duas vezes sem necessidade

Usar:

```text
Gitleaks
```

como ferramenta principal para secrets.

Configurar Trivy conforme o objetivo, evitando duplicar a mesma verificação sem necessidade.

---

## 5. Reutilizar a mesma imagem

O artefato analisado pelo Trivy deve ser o artefato que será utilizado no deploy.

```text
Build
 ↓
Image:commit-sha
 ↓
Trivy
 ↓
Deploy
```

Isso melhora rastreabilidade e segurança.

---

# 39. O que não devemos fazer

Evitar:

```text
Gitleaks
 ↓
Trivy secrets
 ↓
OpenGrep
 ↓
GitLab SAST
 ↓
SonarQube
 ↓
Trivy fs
 ↓
Trivy image
 ↓
ZAP
```

sem uma justificativa clara.

Isso gera:

```text
Mais tempo
+
Mais findings duplicados
+
Mais falsos positivos
+
Mais manutenção
```

---

# 40. GitLab SAST x OpenGrep

Aqui existe uma decisão arquitetural importante.

A pipeline atual possui:

```yaml
include:
  - template: Security/SAST.gitlab-ci.yml
```

Isso adiciona os analyzers de SAST gerenciados pelo GitLab.

Se decidirmos utilizar:

```text
OpenGrep
```

como nosso scanner SAST principal, devemos verificar exatamente quais analyzers do GitLab SAST estão sendo executados.

O GitLab executa analyzers de acordo com as linguagens detectadas.

Documentação:

```text
https://docs.gitlab.com/user/application_security/sast/analyzers/
```

Se houver duplicação relevante entre:

```text
GitLab SAST
+
OpenGrep
+
SonarQube
```

podemos desativar analyzers específicos ou até revisar se o template SAST é necessário para o projeto.

Não devemos simplesmente manter todos os scanners sem verificar o que cada um está analisando.

---

# 41. Decisão recomendada para este projeto

Para o backend Java/Spring Boot, uma configuração inicial razoável seria:

```text
Gitleaks
     ↓
Secrets

OpenGrep
     ↓
SAST focado em segurança

SonarQube
     ↓
Quality + Security + Quality Gate

Trivy
     ↓
Dependencies + Image + Misconfiguration

OWASP ZAP
     ↓
DAST em staging
```

O GitLab SAST pode ser:

```text
mantido
```

se seus analyzers adicionarem cobertura útil.

Ou:

```text
reduzido/desativado
```

se houver sobreposição excessiva com OpenGrep e SonarQube.

Essa decisão deve ser baseada nos findings reais produzidos pelas ferramentas, e não apenas pela quantidade de ferramentas.

---

# 42. Estratégia por branch

## Merge Request

Objetivo:

```text
Feedback rápido
```

Executar:

```text
Gitleaks
OpenGrep
SonarQube
Tests
Checkstyle
```

Não executar necessariamente:

```text
ZAP
Deploy Production
```

---

## Develop

Objetivo:

```text
Integração + Staging
```

Executar:

```text
Gitleaks
OpenGrep
SonarQube
Tests
Checkstyle
Build
Trivy
Deploy Staging
ZAP
```

---

## Main

Objetivo:

```text
Produção
```

Executar:

```text
Gitleaks
OpenGrep
SonarQube
Tests
Checkstyle
Build
Trivy
Deploy
```

O ZAP pode ter sido executado no staging antes da promoção.

---

# 43. Estratégia de promoção

O fluxo ideal é:

```text
Commit
  ↓
Build
  ↓
Security Checks
  ↓
Container
  ↓
Trivy
  ↓
Staging
  ↓
ZAP
  ↓
Aprovação / Gate
  ↓
Production
```

A ideia é não reconstruir a aplicação entre staging e produção.

O mesmo artefato deve ser promovido:

```text
Image SHA X
    │
    ├── Staging
    │
    └── Production
```

Isso é conhecido como promoção do mesmo artefato.

---

# 44. Estrutura final recomendada

```text
.gitlab-ci.yml

          │
          ├── workflow
          │
          ├── variables
          │
          ├── cache
          │
          ├── stages
          │
          ├── security
          │    ├── gitleaks
          │    └── opengrep
          │
          ├── test
          │    └── maven-test
          │
          ├── quality
          │    ├── sonarqube
          │    └── checkstyle
          │
          ├── build
          │    └── docker-build
          │
          ├── container-security
          │    └── trivy
          │
          ├── deploy-test
          │    └── staging
          │
          ├── dast
          │    └── zap
          │
          └── deploy
               └── production
```

---

# 45. Resultado esperado

O objetivo final não é simplesmente:

```text
5 ferramentas
```

mas:

```text
5 camadas complementares
```

```text
┌──────────────────────────────────────┐
│ Gitleaks                             │
│ Secrets                              │
├──────────────────────────────────────┤
│ OpenGrep                             │
│ SAST                                 │
├──────────────────────────────────────┤
│ SonarQube                            │
│ Code Quality + Security              │
├──────────────────────────────────────┤
│ Trivy                                │
│ Dependencies + Container             │
├──────────────────────────────────────┤
│ OWASP ZAP                            │
│ DAST                                 │
└──────────────────────────────────────┘
```

---

# 46. Conclusão

A pipeline atual já possui uma boa base, mas as ferramentas estão concentradas no mesmo stage e algumas verificações podem estar sobrepostas.

A evolução proposta é:

```text
Pipeline atual

test
 ↓
muitas ferramentas
 ↓
push
 ↓
deploy
```

para:

```text
Pipeline planejada

Security
   ↓
Test
   ↓
Quality
   ↓
Build
   ↓
Container Security
   ↓
Deploy Test
   ↓
DAST
   ↓
Deploy
```

A principal estratégia para evitar lentidão é:

```text
1. Paralelizar verificações independentes
2. Utilizar cache
3. Evitar scanners duplicados
4. Fixar versões das ferramentas
5. Escanear a imagem final com Trivy
6. Executar ZAP somente depois do deploy de staging
7. Utilizar regras diferentes para MR/develop/main
8. Promover o mesmo artefato entre ambientes
9. Tornar os gates progressivamente mais rígidos
```

Assim, a pipeline deixa de ser apenas uma sequência de ferramentas e passa a funcionar como um processo de **CI/CD + DevSecOps**, com cada ferramenta tendo uma responsabilidade definida.

---

# 47. Referências

GitLab — SAST:

```text
https://docs.gitlab.com/user/application_security/sast/
```

GitLab — SAST Analyzers:

```text
https://docs.gitlab.com/user/application_security/sast/analyzers/
```

GitLab — Security Configuration:

```text
https://docs.gitlab.com/user/application_security/detect/security_configuration/
```

SonarQube — GitLab CI/CD:

```text
https://docs.sonarsource.com/sonarqube-server/latest/devops-platform-integration/gitlab-integration/adding-analysis-to-gitlab-ci-cd/
```

Trivy:

```text
https://trivy.dev/docs/latest/
```

OpenGrep:

```text
https://github.com/opengrep/opengrep
```

OWASP ZAP:

```text
https://www.zaproxy.org/docs/
```

OWASP ZAP Baseline Scan:

```text
https://www.zaproxy.org/docs/docker/baseline-scan/
```
