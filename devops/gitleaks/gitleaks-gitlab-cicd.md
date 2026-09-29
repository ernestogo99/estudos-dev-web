# Gitleaks

## 1. O que é o Gitleaks?

Video de apoio

```
https://www.youtube.com/watch?v=uHu0F8VJdag
```

Documentação

```
https://github.com/gitleaks/gitleaks
```

O **Gitleaks** é uma ferramenta de segurança utilizada para detectar **secrets (segredos) expostos** em arquivos e repositórios Git.

Seu objetivo é identificar credenciais que tenham sido colocadas acidentalmente no código-fonte, como:

- API Keys;
- Tokens de autenticação;
- Senhas;
- AWS Access Keys;
- Tokens do GitHub/GitLab;
- Chaves privadas;
- Credenciais de banco de dados;
- JWTs e outros tokens;
- Outros padrões que possam representar informações sensíveis.

Exemplo:

```java
public class DatabaseConfig {
    private String username = "admin";
    private String password = "MinhaSenha123";
}
```

O Gitleaks pode identificar que o valor utilizado como senha possui características de um segredo exposto.

Outro exemplo:

```typescript
const API_KEY = "sk-abc123xyz...";
```

Nesse caso, o Gitleaks pode detectar o valor como uma possível chave ou token exposto.

---

## 2. Por que utilizar o Gitleaks?

Secrets expostos no código podem representar um risco de segurança.

O Gitleaks permite automatizar a detecção desses casos e integrá-la ao processo de CI/CD.

A ideia é fazer com que a pipeline verifique o código antes de permitir que as etapas seguintes sejam executadas.

```text
Git Push
   ↓
GitLab CI/CD
   ↓
Gitleaks
   ↓
Existem secrets?
   ├── SIM → Pipeline falha
   └── NÃO → Pipeline continua
```

---

## 3. O que o Gitleaks faz?

O Gitleaks funciona principalmente como um **detector**.

Ele procura padrões que possam representar secrets dentro do código e do histórico do Git.

### Importante

O Gitleaks **não criptografa os secrets** e não substitui uma estratégia adequada de gerenciamento de credenciais.

Por exemplo, ele não transforma automaticamente:

```yaml
password: senha123
```

em:

```yaml
password: ${DB_PASSWORD}
```

A responsabilidade de armazenar e fornecer o secret de forma segura continua sendo da aplicação e da infraestrutura.

---

# 4. Gitleaks e o histórico do Git

Um secret removido do arquivo atual pode continuar existindo no histórico do Git.

Por exemplo:

```text
Commit 1
    password = "123456"

Commit 2
    password = "${DB_PASSWORD}"
```

No estado atual do projeto, a senha não está mais no arquivo. Porém, ela pode continuar disponível no histórico.

Por isso, o Gitleaks também pode ser utilizado para analisar o histórico do repositório.

> Remover um secret do arquivo atual não significa necessariamente que ele deixou de existir no histórico do Git.

Se uma credencial real tiver sido exposta, também é necessário **revogar ou rotacionar a credencial**, além de tratar o histórico quando apropriado.

---

# 5. Gitleaks no GitLab CI/CD

Uma aplicação prática é adicionar o Gitleaks como uma etapa inicial da pipeline.

```text
                    GitLab
                       │
                       ▼
                ┌─────────────┐
                │   Gitleaks  │
                └──────┬──────┘
                       │
                Secrets encontrados?
                   ┌───┴───┐
                  SIM      NÃO
                   │        │
                   ▼        ▼
                ❌ STOP   ┌───────┐
                          │ Tests │
                          └───┬───┘
                              ▼
                          Quality
                              ▼
                           Build
                              ▼
                           Deploy
```

O objetivo é detectar secrets antes que a pipeline avance para etapas como testes, build ou deploy.

---

# 6. Configurando o Gitleaks no GitLab CI/CD

## 6.1. Definindo os stages

Um exemplo de `.gitlab-ci.yml`:

```yaml
stages:
  - security
  - test
  - quality
  - build
  - deploy
```

O Gitleaks será executado no estágio `security`.

## 6.2. Criando o job do Gitleaks

Uma forma simples de executar o Gitleaks é utilizando uma imagem Docker que já contenha a ferramenta:

```yaml
gitleaks:
  stage: security
  image:
    name: zricethezav/gitleaks:latest
    entrypoint: [""]
  script:
    - gitleaks detect --source . --verbose
```

O comando:

```bash
gitleaks detect --source . --verbose
```

instrui o Gitleaks a analisar o projeto atual.

### Comportamento da pipeline

Se nenhum secret for encontrado:

```text
Gitleaks
   ↓
Nenhum secret encontrado
   ↓
Job SUCCESS
   ↓
Pipeline continua
```

Se um secret for encontrado:

```text
Gitleaks
   ↓
Secret encontrado
   ↓
Job FAILED
   ↓
Pipeline interrompida
```

---

# 7. Exemplo completo

Um exemplo de pipeline simples:

```yaml
stages:
  - security
  - test
  - build
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

deploy:
  stage: deploy
  script:
    - echo "Deploy da aplicação"
```

A ordem de execução será:

```text
security
   │
   ▼
Gitleaks
   │
   ├── ❌ Secret encontrado
   │       ↓
   │    Pipeline para
   │
   └── ✅ Nenhum secret
           ↓
          test
           ↓
         build
           ↓
        deploy
```

---

# 8. Configurando o `.gitleaks.toml`

O Gitleaks permite configurar regras específicas para o projeto utilizando um arquivo:

```text
.gitleaks.toml
```

Uma estrutura básica pode ser:

```toml
title = "Gitleaks configuration"

[extend]
useDefault = true
```

A opção `useDefault = true` permite utilizar as regras padrão do Gitleaks e, posteriormente, adicionar regras específicas para o projeto.

---

# 9. Ignorando arquivos ou diretórios

Em determinados projetos existem arquivos que podem gerar falsos positivos.

Essas exceções devem ser tratadas com cuidado.

Antes de adicionar uma exceção, é importante verificar se o conteúdo realmente não contém uma credencial real.

O objetivo não deve ser simplesmente esconder o resultado do Gitleaks, mas reduzir falsos positivos sem comprometer a segurança.

---

# 10. Gitleaks e variáveis do GitLab

Uma prática melhor do que colocar credenciais diretamente no código é utilizar as **CI/CD Variables do GitLab**.

Em vez de:

```yaml
database:
  password: "senha123"
```

a aplicação pode utilizar uma variável:

```yaml
database:
  password: ${DB_PASSWORD}
```

E o valor real pode ser armazenado nas variáveis protegidas do GitLab.

Fluxo:

```text
GitLab CI/CD Variables
          │
          ▼
      DB_PASSWORD
          │
          ▼
      Aplicação
```

Dessa maneira, a credencial não precisa ser armazenada diretamente no código-fonte.

---

# 11. Gitleaks não substitui gerenciamento de secrets

O Gitleaks deve ser considerado uma camada de segurança, e não a solução completa para gerenciamento de credenciais.

Uma estratégia adequada pode utilizar:

```text
                  Secrets
                     │
          ┌──────────┴──────────┐
          │                     │
     Armazenamento          Detecção
     seguro                  Gitleaks
          │                     │
          ▼                     ▼
 GitLab CI/CD Variables    Código / Git
```

O Gitleaks ajuda a **detectar exposição**.

O mecanismo de secrets ajuda a **armazenar e fornecer credenciais com segurança**.

---

# 12. Gitleaks + GitLab CI/CD + projeto Spring Boot

Para um projeto Spring Boot, uma estrutura de pipeline pode ficar assim:

```yaml
stages:
  - security
  - test
  - quality
  - build
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

quality:
  stage: quality
  script:
    - echo "Análise de qualidade"

build:
  stage: build
  script:
    - echo "Build da aplicação"

deploy:
  stage: deploy
  script:
    - echo "Deploy da aplicação"
```

Nesse cenário, o Gitleaks é a primeira barreira da pipeline.

---

# 13. Boas práticas

### Não colocar secrets diretamente no código

Evite:

```java
private String password = "senha123";
```

Prefira variáveis de ambiente ou mecanismos de gerenciamento de secrets.

### Executar o Gitleaks cedo na pipeline

Colocar a análise no estágio `security` permite detectar o problema antes de etapas mais caras.

### Não ignorar resultados sem investigar

Um falso positivo pode ser tratado com configuração específica, mas uma credencial real deve ser removida e, principalmente, **revogada/rotacionada**.

### Analisar o histórico quando necessário

Um secret removido do arquivo atual pode continuar disponível em commits antigos.

### Não utilizar o Gitleaks como substituto de secret management

O Gitleaks detecta exposição; ele não é um cofre de credenciais.

---

# 14. Resumo

| Item                         | Gitleaks                  |
| ---------------------------- | ------------------------- |
| Objetivo                     | Detectar secrets expostos |
| API Keys                     | ✅                        |
| Tokens                       | ✅                        |
| Senhas                       | ✅                        |
| Chaves privadas              | ✅                        |
| Histórico Git                | ✅ Pode analisar          |
| Criptografa secrets          | ❌                        |
| Armazena secrets             | ❌                        |
| Substitui Secret Manager     | ❌                        |
| Integração com GitLab CI/CD  | ✅                        |
| Pode fazer a pipeline falhar | ✅                        |

## Conceito principal

O Gitleaks funciona como uma **barreira de segurança dentro do processo de desenvolvimento**:

```text
Developer
    │
    ▼
Git Commit / Push
    │
    ▼
GitLab CI/CD
    │
    ▼
Gitleaks
    │
    ├── Secret encontrado → ❌ Pipeline falha
    │
    └── Nenhum secret → ✅ Pipeline continua
                              │
                              ▼
                           Tests
                              │
                              ▼
                           Quality
                              │
                              ▼
                            Build
                              │
                              ▼
                           Deploy
```
