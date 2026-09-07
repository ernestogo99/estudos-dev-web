# LAB 3 - REDES 2

![Ansible](https://img.shields.io/badge/Ansible-EE0000?style=for-the-badge&logo=ansible&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![Node Exporter](https://img.shields.io/badge/Node%20Exporter-6E9F18?style=for-the-badge&logo=prometheus&logoColor=white)

## Sumário

- [Definições](#definições)
- [Ansible](#o-que-é-o-ansible)
- [Grafana](#o-que-é-o-grafana)
- [Prometheus](#o-que-é-o-prometheus)
- [Node Exporter](#o-que-é-o-node-exporter)
- [Execução do laboratório](#execução-do-laboratório)
- [Pré-requisitos](#pré-requisitos)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Passo a passo](#passo-a-passo)
- [Serviços disponíveis](#serviços-disponíveis)

# Definições

## O que é o Ansible?

O **Ansible** é uma ferramenta de **automação e gerenciamento de infraestrutura** utilizada para automatizar tarefas em servidores, aplicações, redes e ambientes de desenvolvimento.

Ele permite executar tarefas de forma **automatizada, padronizada e repetível**, evitando que administradores e desenvolvedores precisem configurar cada servidor manualmente.

Na engenharia de software, o Ansible é muito utilizado para:

- Configuração de servidores;
- Instalação de softwares;
- Implantação de aplicações;
- Gerenciamento de infraestrutura;
- Configuração de ambientes;
- Automação de tarefas repetitivas;
- Gerenciamento de múltiplos servidores;
- Execução de rotinas de manutenção.

### Qual problema o Ansible resolve?

Imagine que uma empresa possui 20 servidores. Em cada servidor é necessário instalar programas, criar diretórios, configurar usuários, copiar arquivos e iniciar serviços.

Sem uma ferramenta de automação, essas tarefas precisariam ser realizadas manualmente em cada servidor. Com o Ansible, o mesmo playbook pode ser executado em todas as máquinas:

```text
Playbook Ansible
                      |
                      +-- Servidor 1
                      +-- Servidor 2
                      +-- Servidor 3
                      +-- ...
                      +-- Servidor 20
```

O **inventário** é o arquivo que define quais máquinas serão gerenciadas pelo Ansible.

## O que é o Grafana?

O **Grafana** é uma plataforma de **monitoramento, observabilidade e visualização de dados**. Ele permite conectar fontes de dados e apresentar as informações por meio de dashboards, gráficos, tabelas, indicadores e alertas.

O Grafana é utilizado para acompanhar a saúde, o desempenho, a disponibilidade e o comportamento de aplicações e infraestruturas. Ele não é, por si só, responsável por armazenar todas as métricas. Normalmente, conecta-se a ferramentas como Prometheus, Loki, Elasticsearch, InfluxDB e bancos de dados SQL.

Seu funcionamento pode ser representado assim:

```text
+---------------------------+
| Aplicação ou infraestrutura |
+-------------+-------------+
              |
              v
+---------------------------+
| Coleta de dados             |
+-------------+-------------+
              |
              v
+---------------------------+
| Fonte de dados              |
+-------------+-------------+
              |
              v
+---------------------------+
| Grafana                     |
+-------------+-------------+
              |
              v
+---------------------------+
| Dashboards e alertas        |
+---------------------------+
```

## O que é o Prometheus?

O **Prometheus** é uma ferramenta de **monitoramento e coleta de métricas** utilizada para acompanhar aplicações, servidores, contêineres e outros componentes de uma infraestrutura.

Enquanto o Grafana é utilizado principalmente para visualizar os dados, o Prometheus é responsável por coletar, armazenar e consultar métricas usando a linguagem **PromQL**.

Uma arquitetura comum é:

```text
+---------------------------+
| Aplicação ou servidor     |
+-------------+-------------+
              | Métricas
              v
+---------------------------+
| Prometheus                 |
| Coleta e armazena métricas|
+-------------+-------------+
              | Consultas PromQL
              v
+---------------------------+
| Grafana                    |
| Dashboards e alertas       |
+---------------------------+
```

## O que é o Node Exporter?

O **Node Exporter** é um componente utilizado junto ao Prometheus para expor métricas de máquinas e sistemas operacionais, especialmente servidores Linux e outras máquinas compatíveis.

Entre as métricas disponibilizadas estão:

- Processador;
- Memória RAM;
- Disco;
- Sistema de arquivos;
- Rede;
- Média de carga;
- Processos;
- Tempo de atividade do servidor;
- Operações de entrada e saída;
- Informações do sistema operacional.

# Execução do laboratório

## Pré-requisitos

Antes de iniciar, verifique se os seguintes itens estão instalados:

- **Docker Desktop**, com suporte ao Docker Compose;

## Estrutura de pastas

```text
lab3-redes/
|-- check_network_api.yaml  # Playbook Ansible para consultar a API REST
|-- docker-compose.yml      # Serviços Node Exporter, Prometheus e Grafana
|-- Dockerfile              # Imagem Docker com Ansible
|-- inventory.ini            # Inventário do host local
|-- prometheus.yml           # Configuração dos alvos de coleta
`-- readme.md               # Documentação do laboratório
```

## Passo a passo

### 1. Criar a imagem do Ansible

```bash
docker build -t lab3-ansible -f Dockerfile .
```

### 2. Verificar o Ansible

```bash
docker run --rm -it -v "${PWD}:/lab" -w /lab lab3-ansible ansible --version
```

### 3. Testar o inventário

```bash
docker run --rm -it -v "${PWD}:/lab" -w /lab lab3-ansible \
       ansible local -i inventory.ini -m ping
```

Saída esperada: uma resposta bem-sucedida contendo `"ping": "pong"`.

### 4. Executar o playbook

```bash
docker run --rm -it -v "${PWD}:/lab" -w /lab lab3-ansible \
       ansible-playbook -i inventory.ini check_network_api.yaml
```

O playbook realiza uma requisição `GET` para `https://httpbin.org/get` e exibe o status HTTP e o endereço IP de origem identificado.

### 5. Iniciar o monitoramento

```bash
docker compose up -d
```

Para interromper os serviços:

```bash
docker compose down
```

O Prometheus está configurado para coletar as próprias métricas e as métricas do Node Exporter a cada 5 segundos.

## Serviços disponíveis

| Serviço           | Endereço                      | Descrição                              | Credenciais                          |
| ----------------- | ----------------------------- | -------------------------------------- | ------------------------------------ |
| **Grafana**       | http://localhost:3000         | Dashboards e visualização das métricas | `admin` / `admin` no primeiro acesso |
| **Prometheus**    | http://localhost:9090         | Métricas e consultas PromQL            | Não se aplica                        |
| **Node Exporter** | http://localhost:9100/metrics | Métricas do sistema operacional        | Não se aplica                        |

Ao configurar o Prometheus como fonte de dados no Grafana, utilize `http://prometheus:9090`, pois a comunicação ocorre entre os contêineres.
