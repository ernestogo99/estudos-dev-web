# Deploy GREat

- passo 1: Conectar com a vpn
- passo 2: acessar via ssh
- passo 3: colocar o login com a porta
- passo 4: cd gsi
- passo 5: fazer o login na docker hub
- passo 6: mandar a imagem atualizada para a docker hub
- passo 7: deletar a imagem antiga (docker rmi Id)

# Mandando a imagem para a docker hub

- construir a imagem local docker build -t greatseplag/seplag-gsi:frontend-prod -f Dockerfile.prod .
- sudo docker compose up -d
