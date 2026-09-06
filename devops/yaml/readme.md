# Arquivo YAML

YAML é um formato de texto usado principalmente para configuração.

- É uma linguagem de serialização de dados

- Criamos arquivos yaml com .yaml ou .yml

- É fácil de ler e intuitivo

```yaml
microservices:
  - app: user-auth
    port: 9000
    version: 1.0
```

- yaml é um superset do json, qualquer arquivo json válido é um arquivo yaml válido

- usamos separação de linhas e identação para validar o arquivo

## Casos de uso

- Docker compose
- Kubernetes
- Ansible

## Sintaxe

Podemos usar um par marcado por chave e valor

usamos o # para comentar

```yaml
# Comente aqui
app:auth
port:9000
version:1.0
```

podemos criar objetos, basta identar e colocar os pares de chave e valor abaixo, o espaço deve ser o mesmo para cada elemento, o - representa lista, no exemplo, se tivessemos vários microsserviços, cada - representa um microsserviço(elemento da lista)

- podemos usar booleanos (true/false ou yes/no)

```yaml
microservices:
  - app: user-auth
    port: 9000
    version: 1.0
    deployed: true

  - app: payment
    port: 9001
    versions:
      - 2.0
      - 3.0
  - app: notification
    port: 9002
    version: 1.5
```

## Exemplo no kubernetes

```yaml
apiVersion: V1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
    - name: nginx-container
      image: nginx
      ports:
        - containerPort:80
      volumeMounts:
        - name: nginx-vol
          mountPath: /usr/nginx/html
    - name: sidecar-container
      image: curlimages/curl
      command: ["/bin/sh"]
      args: ["-c", "echo hello from the sidecar container; sleep 300"]
```

## Multi-line-strings

podemos usar o | para representar uma multi-line-string

o > representa o single-line

```yaml
multilinestring: |
  this is a single line string,
  that should be all in one line.
  some other stuff
```

exemplo:

```yaml
apiVersion: v1
kind: ConfigMap
metaData:
  name: mosquito-config-file
data:
    mosquitto.conf: |
    log_dest stdout
    log_type all
    log_timestamp true
    listener 9001
```

## Variaveis de ambiente

podemos acessar elas usando o $

```yaml
command:
    - /bin/sh
    - -ec
    - >-
    | mysql -h 127.0.0.1 -u root -p$MYSQL_ROOT_PASSWORD -e 'SELECT 1'
```
