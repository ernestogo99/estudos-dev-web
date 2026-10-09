# Pipeline DevSecOps com GitLab CI/CD, SonarQube e DefectDojo

## 1. Objetivo

Implementar uma pipeline DevSecOps no GitLab CI/CD que execute testes automatizados, análise de qualidade e segurança, análise de imagens Docker e testes dinâmicos da aplicação. Os relatórios serão centralizados no DefectDojo para triagem e acompanhamento de vulnerabilidades.

A infraestrutura será executada em uma VM gerenciada pelo Portainer. O Portainer será usado para administrar stacks e contêineres; a pipeline do GitLab continuará sendo responsável por executar as análises e importar os relatórios.

## 2. Arquitetura proposta

```text
Desenvolvedor
    |
    v
GitLab Repository
    |
    v
GitLab CI/CD + GitLab Runner
    |
    +--> Testes e build (Maven, se o projeto for Java)
    +--> SonarQube Scanner ------> SonarQube Server
    +--> Gitleaks
    +--> OpenGrep
    +--> Trivy (filesystem e imagem Docker)
    +--> Deploy em ambiente de teste
              |
              +--> OWASP ZAP (DAST)
    |
    v
Relatórios como artefatos
    |
    v
Importação via API
    |
    v
DefectDojo
    |
    v
Triagem, priorização, correção e validação
```

### Responsabilidade de cada componente

| Componente | Responsabilidade |
|---|---|
| GitLab CI/CD | Orquestrar os jobs, aplicar regras e controlar a sequência da pipeline |
| GitLab Runner | Executar os jobs da pipeline |
| Portainer | Administrar stacks, contêineres, redes e volumes da VM |
| SonarQube | Analisar qualidade e segurança do código e avaliar o Quality Gate |
| Gitleaks | Detectar possíveis segredos expostos no repositório |
| OpenGrep | Executar análise estática com regras compatíveis |
| Trivy | Examinar dependências, arquivos, configurações e imagens de contêiner |
| OWASP ZAP | Testar a aplicação em execução em um ambiente autorizado |
| DefectDojo | Centralizar achados, deduplicar quando aplicável e acompanhar remediação |
| Docker | Executar serviços e construir a imagem da aplicação |

> O DefectDojo não substitui os scanners. Ele recebe e gerencia os achados. Os scanners e os mecanismos de qualidade continuam responsáveis pela detecção e pelos critérios de bloqueio da pipeline.

## 3. Plano de implementação

### Etapa 1 — Levantar e preparar a VM

1. Registrar sistema operacional, CPU, memória, disco e conectividade da VM.
2. Confirmar que Docker Engine e Docker Compose Plugin estão disponíveis.
3. Confirmar o acesso administrativo ao Portainer.
4. Identificar quais serviços já estão executando na VM e quais portas estão ocupadas.
5. Definir endereços estáveis, nomes DNS internos e redes Docker.
6. Planejar volumes persistentes e backups para SonarQube, DefectDojo e respectivos bancos de dados.
7. Definir regras de firewall e quem poderá acessar as interfaces.

**Segurança:** não exponha bancos de dados, Docker socket, interfaces administrativas ou APIs de gestão diretamente à internet. Restrinja o acesso e use HTTPS quando os serviços forem acessados pela rede. Use imagens oficiais, versões fixadas e documentação de instalação correspondente à versão escolhida.

**Critério de conclusão:** a VM tem recursos suficientes, os serviços têm endereços definidos e o acesso administrativo está restrito.

### Etapa 2 — Organizar stacks no Portainer

No Portainer, criar stacks separadas ou agrupamentos bem definidos para:

1. **SonarQube:** servidor, banco de dados suportado e volumes persistentes.
2. **DefectDojo:** aplicação, banco de dados e demais serviços exigidos pela versão escolhida.
3. **GitLab Runner:** somente se o runner também for hospedado nessa VM.
4. **Aplicação de teste:** ambiente isolado e descartável para execução do OWASP ZAP.

Boas práticas:
- Usar Compose/Stacks versionados sempre que possível.
- Manter senhas fora dos arquivos versionados; utilizar secrets ou variáveis seguras conforme a configuração.
- Definir políticas de reinicialização, healthchecks quando suportados, limites de recursos e volumes.
- Não publicar portas de bancos de dados sem necessidade.
- Evitar colocar o runner com privilégios amplos no mesmo ambiente de serviços críticos.
- Não usar `latest` como estratégia de controle de versão; fixar versões e planejar atualizações.

**Critério de conclusão:** as stacks sobem pelo Portainer, os dados persistem e as interfaces necessárias estão acessíveis apenas para os usuários autorizados.

### Etapa 3 — Configurar o GitLab Runner e a conectividade

1. Confirmar que o runner está registrado no GitLab.
2. Confirmar o executor usado; executor Docker costuma ser adequado para jobs em contêineres.
3. Configurar tags e usá-las nos jobs correspondentes.
4. Verificar conectividade do runner para:
   - SonarQube;
   - DefectDojo;
   - registry de imagens;
   - repositórios de imagens e pacotes;
   - ambiente de teste, quando aplicável.
5. Usar o nome DNS ou endereço acessível **a partir do contêiner do job**, e não presumir que `localhost` ou `host.docker.internal` funcionará na VM.
6. Escolher uma estratégia segura para construir imagens Docker. Evitar montar o socket Docker do host sem avaliação de risco, pois isso pode conceder controle elevado sobre a VM.
7. Executar uma pipeline simples para validar clone, rede e acesso aos serviços.

**Critério de conclusão:** o job de teste consegue acessar os serviços sem depender de endereços que só funcionam no computador local.

### Etapa 4 — Configurar variáveis e credenciais

Em **GitLab → Settings → CI/CD → Variables**, cadastrar, conforme necessário:

| Variável sugerida | Uso |
|---|---|
| `SONAR_HOST_URL` | URL do SonarQube |
| `SONAR_TOKEN` | Token de análise |
| `DD_URL` | URL base do DefectDojo |
| `DD_API_KEY` | Token da API do DefectDojo |
| `IMAGE_NAME` | Nome e tag da imagem da aplicação |
| `DAST_TARGET_URL` | URL da aplicação no ambiente de teste |

- Marcar tokens como **Masked** e **Protected** quando apropriado.
- Não armazenar tokens no repositório ou no `.gitlab-ci.yml`.
- Conceder apenas as permissões necessárias.
- Verificar se variáveis protegidas estarão disponíveis nos branches que executam os jobs.
- Usar TLS confiável; não desabilitar validação de certificados como solução permanente.

Os nomes são convenções propostas e podem ser ajustados ao projeto.

### Etapa 5 — Implementar testes e análise SonarQube

Para um backend Java com Maven:

1. Executar testes e verificações, por exemplo `mvn clean verify`.
2. Configurar cobertura de testes, se fizer parte dos requisitos.
3. Executar o SonarScanner for Maven com URL e token fornecidos por variáveis.
4. Aguardar o processamento da análise no servidor SonarQube.
5. Configurar e validar o Quality Gate.
6. Definir se a pipeline deve falhar quando o Quality Gate não for aprovado.

O scanner Maven pode ser chamado pelo próprio Maven; não é obrigatório instalar uma extensão da IDE para a pipeline.

**Critério de conclusão:** testes são executados e a pipeline obtém o resultado do Quality Gate.

### Etapa 6 — Integrar Gitleaks e OpenGrep

**Gitleaks**
1. Executar o scanner sobre o repositório.
2. Gerar um relatório em formato suportado, como JSON.
3. Preservar o relatório como artefato.
4. Definir o comportamento de falha quando houver segredos detectados.
5. Nunca imprimir valores secretos completos nos logs.

**OpenGrep**
1. Definir as regras SAST apropriadas à linguagem do projeto.
2. Executar a análise em um job separado.
3. Gerar saída no formato que será usado na triagem.
4. Confirmar se a versão e o formato escolhidos têm parser compatível no DefectDojo. Se não houver, planejar conversão para um formato suportado ou avaliar outro mecanismo de importação.

**Critério de conclusão:** ambos os jobs executam de forma reproduzível e guardam seus relatórios.

### Etapa 7 — Integrar Trivy

Executar o Trivy em alvos diferentes, sem misturar suas finalidades:

1. **Filesystem/repositório:** examinar dependências e configurações suportadas.
2. **Imagem Docker:** examinar a imagem final construída.
3. **Configurações/IaC:** opcionalmente, examinar arquivos de infraestrutura suportados.
4. Gerar relatórios nos formatos necessários e armazená-los como artefatos.
5. Definir limites de severidade e exceções justificadas, com prazo de revisão.

Não assumir que todo relatório do Trivy pode ser importado com o mesmo parser. Escolher o parser correspondente ao tipo de relatório e validar uma importação real.

**Critério de conclusão:** a imagem é analisada e o relatório identifica achados de teste conhecidos, sem expor dados sensíveis nos logs.

### Etapa 8 — Configurar OWASP ZAP (DAST)

1. Preparar uma instância da aplicação em ambiente de teste.
2. Aguardar o healthcheck ou confirmar que a aplicação está pronta.
3. Executar inicialmente o baseline scan do ZAP.
4. Salvar o relatório em formato compatível com o parser do DefectDojo.
5. Configurar timeouts e limpeza do ambiente de teste.
6. Executar scans mais agressivos apenas em ambientes autorizados e controlados.

**Critério de conclusão:** o ZAP consegue acessar a aplicação de teste e gera um relatório reproduzível.

### Etapa 9 — Instalar e configurar o DefectDojo

1. Implantar o DefectDojo usando o procedimento oficial da versão escolhida, administrado pela stack do Portainer.
2. Configurar persistência e backup do banco de dados e dos arquivos necessários.
3. Restringir o acesso à interface administrativa e configurar HTTPS.
4. Criar a organização e o produto que representam a aplicação.
5. Criar um engagement para a execução ou ciclo de teste.
6. Criar uma credencial de API com permissões mínimas necessárias.
7. Testar a API a partir de um job do GitLab Runner.
8. Registrar os tipos de scan e os parsers a serem utilizados por ferramenta.

Documentação oficial:
- DefectDojo: https://docs.defectdojo.com/
- Importação de dados: https://docs.defectdojo.com/import_data/import_intro/

**Critério de conclusão:** a pipeline consegue autenticar-se e o produto/engagement de destino existe.

### Etapa 10 — Importar os relatórios para o DefectDojo

Criar um job `import_results` que:

1. Baixe ou receba os artefatos produzidos pelos jobs de scanner.
2. Envie cada relatório pelo endpoint de importação ou reimportação adequado à versão da API.
3. Informe o produto, engagement e tipo de scan corretos.
4. Trate erros HTTP, falhas de autenticação e relatórios inválidos.
5. Não registre o token da API nos logs.
6. Preserve os artefatos mesmo se a importação falhar.
7. Valide deduplicação, reimportação e atualização do estado dos achados.

Antes de automatizar todos os parsers, faça uma importação manual ou um job de prova com um relatório de cada ferramenta. O suporte a formatos depende do parser e da versão do DefectDojo.

**Critério de conclusão:** os achados aparecem no produto correto e execuções posteriores não criam duplicações desnecessárias.

### Etapa 11 — Organizar os stages da pipeline

Exemplo inicial de estrutura para `.gitlab-ci.yml`:

```yaml
stages:
  - validate
  - test
  - sast
  - build
  - container_scan
  - deploy_test
  - dast
  - import_results
  - deploy

default:
  interruptible: true

variables:
  GIT_DEPTH: "0"

# Adicionar os jobs concretos gradualmente.
# Configure needs/dependencies e artifacts para transferir
# relatórios entre os jobs.
# O deploy final deve depender dos gates obrigatórios.
```

O exemplo é apenas a estrutura de stages, não uma pipeline executável completa. Os jobs devem especificar imagens, comandos, artefatos, regras, tags de runner, dependências e condições de falha.

### Etapa 12 — Definir critérios de bloqueio

Separar a **detecção** da **decisão de bloquear**:

- Testes unitários falhando: bloquear.
- Quality Gate obrigatório não aprovado: bloquear.
- Segredo real detectado: bloquear e tratar o segredo exposto; revogar/rotacionar a credencial quando necessário.
- Vulnerabilidades críticas ou altas: aplicar uma política acordada para o tipo de ativo e contexto.
- Falha de importação no DefectDojo: preservar os relatórios e alertar; decidir explicitamente se essa falha bloqueia o deploy.
- OWASP ZAP: começar em modo de observação e evoluir para bloqueios com limites de severidade e regras validadas.

Não ignorar falhas de scanner silenciosamente. Se um job for temporariamente não bloqueante, isso deve ser explícito, monitorado e ter prazo para correção.

### Etapa 13 — Validar ponta a ponta

1. Executar a pipeline com o código normal.
2. Confirmar que todos os scanners executam e produzem relatórios.
3. Confirmar que os relatórios são guardados como artefatos.
4. Confirmar que o DefectDojo recebe os achados.
5. Testar com exemplos controlados e seguros de achados.
6. Corrigir um achado e executar novamente para validar a atualização.
7. Simular uma falha de Quality Gate e verificar o bloqueio.
8. Simular falha de API e verificar logs, alertas e preservação dos relatórios.
9. Verificar permissões e garantir que segredos não aparecem nos logs.
10. Documentar o processo de triagem, exceção e remediação.

## 4. Stages recomendados

| Stage | Jobs esperados |
|---|---|
| `validate` | Verificações de configuração e dependências básicas |
| `test` | Testes automatizados e cobertura |
| `sast` | SonarQube, Gitleaks e OpenGrep |
| `build` | Construção da aplicação e da imagem |
| `container_scan` | Trivy sobre a imagem |
| `deploy_test` | Subir aplicação em ambiente de teste |
| `dast` | OWASP ZAP |
| `import_results` | Enviar relatórios ao DefectDojo |
| `deploy` | Publicação final após os gates obrigatórios |

A ordem pode ser ajustada com `needs:` para permitir execução paralela sem perder a disponibilidade dos artefatos.

## 5. Checklist de conclusão

- [ ] VM e Docker verificados.
- [ ] Stacks gerenciadas pelo Portainer e volumes persistentes configurados.
- [ ] Runner registrado e com conectividade validada.
- [ ] Variáveis e tokens configurados com segurança.
- [ ] Testes Maven e SonarQube/Quality Gate funcionando, quando aplicáveis.
- [ ] Gitleaks gerando relatório.
- [ ] OpenGrep executando e com formato de saída definido.
- [ ] Trivy filesystem e imagem configurados.
- [ ] Aplicação de teste acessível ao ZAP.
- [ ] DefectDojo configurado com produto e engagement.
- [ ] Importação validada para cada parser.
- [ ] Deduplicação e atualização de achados verificadas.
- [ ] Regras de bloqueio documentadas e testadas.
- [ ] Logs, artefatos, backups e credenciais revisados.

## 6. Ordem prática para começar

Implementar incrementalmente:

1. Validar VM, Portainer, runner e conectividade.
2. Confirmar testes Maven e SonarQube.
3. Integrar Gitleaks e Trivy.
4. Subir DefectDojo e importar um relatório de prova.
5. Integrar OpenGrep após validar seu formato de saída.
6. Configurar build da imagem e Trivy sobre a imagem.
7. Preparar ambiente de teste e integrar ZAP.
8. Automatizar todas as importações.
9. Definir gates e validar o fluxo completo antes do deploy final.

## 7. Informações necessárias antes de escrever os jobs definitivos

- Sistema operacional e recursos da VM.
- Se o GitLab Runner também está na VM e qual executor utiliza.
- Se o SonarQube já está instalado via Portainer e qual URL o runner consegue acessar.
- Se a aplicação é Java/Spring Boot com Maven ou usa outra stack.
- Se há registry de imagens e qual estratégia de build é permitida.
- URL e método de acesso ao ambiente de teste.
- Versões escolhidas para DefectDojo, Trivy, Gitleaks, OpenGrep e OWASP ZAP.

Essas informações determinam os nomes de rede, imagens, comandos e regras finais. Não é recomendável copiar uma pipeline genérica para produção sem validar esses pontos.
