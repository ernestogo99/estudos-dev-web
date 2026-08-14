# Micro front-ends

Definição:

Micro-frontends (MFEs) são uma abordagem arquitetural que aplica os princípios dos microserviços ao frontend. Em vez de ter uma única aplicação frontend monolítica, a interface é dividida em partes menores, independentes e desenvolvidas por equipes diferentes.

Por que usar?

para evitar os gargalos gerados nos monolitos e evitar dificuldade de escalar times

## Vantagens

- Times autônomos
- Deploy independente
- Liberdade tecnológica
- Menor acoplamento

## Desafios

- Complexidade operacional
- Governança
- Tamanho da aplicação
- Duplicação de libs
- Consistência de UX

## Mitigações

- Design system: é um conjunto de padrões, componentes, regras visuais e boas práticas que garantem consistência em uma aplicação ou em vários produtos de uma empresa.
- Boilerplates(Templates) é uma estrutura inicial pronta para começar um projeto.
- CI/CD padronizado

## Arquitetura

Em uma arquitetura de micro-frontends, o Shell (também chamado de Container App, Host App ou Root Application) é a aplicação principal responsável por orquestrar os demais micro-frontends.

o shell:

- renderiza layout comum
- gerencia autenticação
- carrega os micro-front-ends

## Comunicação

- De cima para baixo(top-down) feita passando props/atributos
- De baixo para cima(botton-up) o micro front-end se comunica com o shell, podemos fazer por meio de custom events
- Alternativa: event bus(pub/sub) criariamos uma lib e essa lib seria compartilhada entre o shell e os micro front-end e eles se comunicariam pelo pub/sub

## Estratégias de implementação

- Iframes: Isolamento total, mas possui péssima UX
- Build time(NPM) simples, mas sem deploy independente
- Web components: nativo, mas não resolve o problema das libs compartilhada

### Module federation

Com essa estratégia, fazemos o carregamento dinâmico de módulos

Conceitos chave

- host: o consumidor(shell)
- remote: o provedor(o microfrontend)
- Exposes: o que um remote exporta
- shared: as dependências compartilhadas
