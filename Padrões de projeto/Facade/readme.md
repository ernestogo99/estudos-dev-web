# Padrão de Projeto Facade (Fachada)

## 1. O que é o Facade?

O **Facade (Fachada)** é um padrão de projeto **estrutural** que fornece uma interface simplificada para um conjunto de classes ou subsistemas que possuem uma implementação mais complexa.

A ideia principal é:

> **Esconder a complexidade de um subsistema atrás de uma interface mais simples.**

Em vez de o cliente precisar conhecer e coordenar várias classes, ele interage com uma única classe: a **Facade**.

### Exemplo conceitual

Sem Facade:

```text
Cliente
   │
   ├── EstoqueService
   ├── PagamentoService
   ├── FreteService
   └── NotificacaoService
```

Com Facade:

```text
             ┌───────────────────┐
Cliente ────►│   PedidoFacade    │
             └─────────┬─────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Estoque       Pagamento      Frete
       Service       Service       Service
                       │
                       ▼
                  Notificação
```

O cliente conhece apenas a `PedidoFacade`.

---

# 2. Qual problema o Facade resolve?

Imagine que precisamos implementar uma operação para realizar uma compra.

Para isso, precisamos:

1. Verificar se o produto está disponível.
2. Reservar o produto.
3. Processar o pagamento.
4. Calcular o frete.
5. Criar o pedido.
6. Enviar uma notificação.

Sem uma Facade, o código cliente poderia ficar assim:

```java
EstoqueService estoque = new EstoqueService();
PagamentoService pagamento = new PagamentoService();
FreteService frete = new FreteService();
NotificacaoService notificacao = new NotificacaoService();

if (estoque.verificarDisponibilidade("Notebook")) {
    estoque.reservar("Notebook");

    pagamento.processar(2500.00);

    double valorFrete = frete.calcular("Fortaleza");

    notificacao.enviar("Compra realizada com sucesso!");
}
```

O cliente precisa conhecer:

* `EstoqueService`
* `PagamentoService`
* `FreteService`
* `NotificacaoService`
* a ordem das operações
* as regras de interação entre essas classes

Isso cria um **acoplamento maior** entre o cliente e o subsistema.

---

# 3. Solução utilizando Facade

Criamos uma classe responsável por coordenar essas operações:

```java
public class PedidoFacade {

    private final EstoqueService estoqueService;
    private final PagamentoService pagamentoService;
    private final FreteService freteService;
    private final NotificacaoService notificacaoService;

    public PedidoFacade() {
        this.estoqueService = new EstoqueService();
        this.pagamentoService = new PagamentoService();
        this.freteService = new FreteService();
        this.notificacaoService = new NotificacaoService();
    }

    public void realizarPedido(
            String produto,
            double valor,
            String endereco) {

        if (!estoqueService.verificarDisponibilidade(produto)) {
            System.out.println("Produto indisponível.");
            return;
        }

        estoqueService.reservar(produto);

        pagamentoService.processar(valor);

        double frete = freteService.calcular(endereco);

        System.out.println("Frete: R$ " + frete);

        notificacaoService.enviar(
                "Pedido realizado com sucesso!"
        );
    }
}
```

Agora o cliente pode simplesmente fazer:

```java
public class Main {

    public static void main(String[] args) {

        PedidoFacade pedidoFacade = new PedidoFacade();

        pedidoFacade.realizarPedido(
                "Notebook",
                2500.00,
                "Fortaleza"
        );
    }
}
```

O cliente não precisa saber como a compra funciona internamente.

---

# 4. Exemplo completo

Vamos construir um exemplo completo.

## Estrutura

```text
src/
├── Main.java
├── facade/
│   └── PedidoFacade.java
├── estoque/
│   └── EstoqueService.java
├── pagamento/
│   └── PagamentoService.java
├── frete/
│   └── FreteService.java
└── notificacao/
    └── NotificacaoService.java
```

---

## 4.1 EstoqueService

```java
public class EstoqueService {

    public boolean verificarDisponibilidade(String produto) {
        System.out.println(
                "Verificando disponibilidade do produto..."
        );

        return true;
    }

    public void reservar(String produto) {
        System.out.println(
                "Produto reservado: " + produto
        );
    }
}
```

---

## 4.2 PagamentoService

```java
public class PagamentoService {

    public void processar(double valor) {
        System.out.println(
                "Processando pagamento de R$ " + valor
        );
    }
}
```

---

## 4.3 FreteService

```java
public class FreteService {

    public double calcular(String endereco) {

        System.out.println(
                "Calculando frete para: " + endereco
        );

        return 25.00;
    }
}
```

---

## 4.4 NotificacaoService

```java
public class NotificacaoService {

    public void enviar(String mensagem) {
        System.out.println(
                "Enviando notificação: " + mensagem
        );
    }
}
```

---

# 5. A Facade

Agora criamos a classe que coordena o subsistema:

```java
public class PedidoFacade {

    private final EstoqueService estoqueService;
    private final PagamentoService pagamentoService;
    private final FreteService freteService;
    private final NotificacaoService notificacaoService;

    public PedidoFacade() {
        this.estoqueService = new EstoqueService();
        this.pagamentoService = new PagamentoService();
        this.freteService = new FreteService();
        this.notificacaoService = new NotificacaoService();
    }

    public void realizarPedido(
            String produto,
            double valor,
            String endereco) {

        boolean disponivel =
                estoqueService.verificarDisponibilidade(produto);

        if (!disponivel) {
            System.out.println("Produto indisponível.");
            return;
        }

        estoqueService.reservar(produto);

        pagamentoService.processar(valor);

        double valorFrete =
                freteService.calcular(endereco);

        System.out.println(
                "Valor do frete: R$ " + valorFrete
        );

        notificacaoService.enviar(
                "Pedido realizado com sucesso."
        );
    }
}
```

---

# 6. Cliente

O cliente agora possui uma interface muito mais simples:

```java
public class Main {

    public static void main(String[] args) {

        PedidoFacade facade = new PedidoFacade();

        facade.realizarPedido(
                "Notebook",
                2500.00,
                "Fortaleza"
        );
    }
}
```

Observe que `Main` não conhece diretamente:

```java
EstoqueService
PagamentoService
FreteService
NotificacaoService
```

Ele conhece apenas:

```java
PedidoFacade
```

---

# 7. Antes e depois

## Sem Facade

```java
EstoqueService estoque = new EstoqueService();
PagamentoService pagamento = new PagamentoService();
FreteService frete = new FreteService();
NotificacaoService notificacao = new NotificacaoService();

if (estoque.verificarDisponibilidade("Notebook")) {

    estoque.reservar("Notebook");

    pagamento.processar(2500);

    double valorFrete =
            frete.calcular("Fortaleza");

    notificacao.enviar(
            "Pedido realizado!"
    );
}
```

O cliente precisa conhecer todo o processo.

---

## Com Facade

```java
PedidoFacade facade = new PedidoFacade();

facade.realizarPedido(
        "Notebook",
        2500,
        "Fortaleza"
);
```

O cliente conhece apenas a operação que deseja executar.

---

# 8. Responsabilidade da Facade

É importante entender que a Facade **não necessariamente implementa toda a lógica de negócio**.

Sua principal responsabilidade é **coordenar o acesso ao subsistema**.

Por exemplo:

```java
public class PedidoFacade {

    private final EstoqueService estoque;
    private final PagamentoService pagamento;
    private final FreteService frete;

    public void realizarPedido(...) {

        estoque.reservar(...);

        pagamento.processar(...);

        frete.calcular(...);
    }
}
```

A Facade funciona como um **ponto de entrada simplificado**.

---

# 9. Facade não significa esconder todas as classes

Uma dúvida comum é:

> "Se tenho uma Facade, ninguém pode acessar as classes internas?"

Não.

As classes do subsistema continuam existindo.

Por exemplo:

```java
EstoqueService estoque = new EstoqueService();

estoque.verificarDisponibilidade("Notebook");
```

Ainda é possível utilizá-las diretamente.

A Facade apenas oferece uma forma mais simples e conveniente de acessar o subsistema.

Portanto:

```text
                 ┌─────────────────┐
                 │      Cliente    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │     Facade      │
                 └────────┬────────┘
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
          Service      Service      Service
```

Mas também pode existir:

```text
Cliente ───────────────► Service
   │
   └───────────────────► Facade
```

A Facade não precisa ser uma barreira obrigatória.

---

# 10. Segundo exemplo: sistema de computador

Um exemplo clássico de Facade é inicializar um computador.

Imagine que ligar um computador envolva:

```text
CPU
Memory
HardDrive
OperatingSystem
```

Sem Facade:

```java
CPU cpu = new CPU();
Memory memory = new Memory();
HardDrive hardDrive = new HardDrive();

cpu.freeze();

memory.load(0, hardDrive.read(0, 1024));

cpu.jump(0);

cpu.execute();
```

O cliente precisa conhecer detalhes de inicialização.

Podemos criar:

```java
public class ComputerFacade {

    private final CPU cpu;
    private final Memory memory;
    private final HardDrive hardDrive;

    public ComputerFacade() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
    }

    public void start() {

        cpu.freeze();

        memory.load(
                0,
                hardDrive.read(0, 1024)
        );

        cpu.jump(0);

        cpu.execute();
    }
}
```

Agora:

```java
public class Main {

    public static void main(String[] args) {

        ComputerFacade computer =
                new ComputerFacade();

        computer.start();
    }
}
```

A operação complexa:

```text
freeze
   ↓
read
   ↓
load
   ↓
jump
   ↓
execute
```

foi encapsulada em:

```java
computer.start();
```

---

# 11. Exemplo com sistema de pagamentos

Imagine um sistema que precisa realizar um pagamento.

Existem vários componentes:

```text
PaymentValidator
PaymentGateway
FraudService
TransactionService
ReceiptService
```

Sem Facade:

```java
PaymentValidator validator =
        new PaymentValidator();

PaymentGateway gateway =
        new PaymentGateway();

FraudService fraud =
        new FraudService();

TransactionService transaction =
        new TransactionService();

ReceiptService receipt =
        new ReceiptService();

validator.validate();

fraud.analyze();

gateway.process();

transaction.save();

receipt.generate();
```

Podemos criar:

```java
public class PaymentFacade {

    private final PaymentValidator validator;
    private final PaymentGateway gateway;
    private final FraudService fraud;
    private final TransactionService transaction;
    private final ReceiptService receipt;

    public PaymentFacade() {

        this.validator = new PaymentValidator();
        this.gateway = new PaymentGateway();
        this.fraud = new FraudService();
        this.transaction = new TransactionService();
        this.receipt = new ReceiptService();
    }

    public void pay() {

        validator.validate();

        fraud.analyze();

        gateway.process();

        transaction.save();

        receipt.generate();
    }
}
```

Cliente:

```java
public class Main {

    public static void main(String[] args) {

        PaymentFacade payment =
                new PaymentFacade();

        payment.pay();
    }
}
```

---

# 12. Facade e redução de acoplamento

Uma das principais vantagens do Facade é reduzir o **acoplamento do cliente com o subsistema**.

Sem Facade:

```text
Cliente
  │
  ├────► Service A
  ├────► Service B
  ├────► Service C
  ├────► Service D
  └────► Service E
```

O cliente conhece cinco componentes.

Com Facade:

```text
Cliente
   │
   ▼
Facade
   │
   ├────► Service A
   ├────► Service B
   ├────► Service C
   ├────► Service D
   └────► Service E
```

O cliente conhece apenas a Facade.

---

# 13. Facade e encapsulamento

A Facade também pode ser utilizada para controlar quais operações são expostas para o cliente.

Por exemplo, internamente podemos ter:

```java
public class DatabaseService {

    public void connect() {
        // ...
    }

    public void authenticate() {
        // ...
    }

    public void executeQuery() {
        // ...
    }

    public void closeConnection() {
        // ...
    }
}
```

Mas o cliente pode não precisar conhecer todo esse processo.

A Facade pode fornecer:

```java
public class DatabaseFacade {

    private final DatabaseService database;

    public DatabaseFacade() {
        this.database = new DatabaseService();
    }

    public void execute(String query) {

        database.connect();

        database.authenticate();

        database.executeQuery();

        database.closeConnection();
    }
}
```

Cliente:

```java
DatabaseFacade database =
        new DatabaseFacade();

database.execute(
        "SELECT * FROM users"
);
```

---

# 14. Facade não é a mesma coisa que Service

É importante não confundir.

Uma classe `Service` normalmente representa uma responsabilidade ou operação específica do sistema.

Por exemplo:

```java
EstoqueService
PagamentoService
FreteService
```

Uma Facade normalmente **coordena várias dessas operações**.

```text
                   PedidoFacade
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Estoque       Pagamento      Frete
       Service       Service       Service
```

Podemos pensar:

```text
Service
    ↓
Executa uma responsabilidade

Facade
    ↓
Coordena várias responsabilidades
```

Isso não significa que toda classe que chama vários services seja automaticamente uma Facade. O objetivo arquitetural e o contexto importam.

---

# 15. Facade vs Adapter

Facade e Adapter são padrões estruturais, mas resolvem problemas diferentes.

## Facade

Simplifica um subsistema.

```text
Cliente
   ↓
Facade
   ↓
Subsistema complexo
```

Objetivo:

> Tornar uma interface complexa mais simples de utilizar.

---

## Adapter

Adapta uma interface incompatível.

```text
Cliente
   ↓
Interface esperada
   ↓
Adapter
   ↓
Classe existente
```

Objetivo:

> Fazer duas interfaces incompatíveis trabalharem juntas.

### Resumindo

| Padrão    | Objetivo                              |
| --------- | ------------------------------------- |
| Facade    | Simplificar uma interface             |
| Adapter   | Adaptar uma interface                 |
| Decorator | Adicionar comportamento               |
| Proxy     | Controlar acesso                      |
| Composite | Trabalhar com estruturas hierárquicas |

---

# 16. Facade vs Proxy

Facade e Proxy também podem parecer semelhantes.

## Facade

O objetivo é fornecer uma **interface simplificada** para um subsistema.

```text
Cliente
   ↓
Facade
   ↓
Vários componentes
```

---

## Proxy

O objetivo é representar ou controlar o acesso a outro objeto.

```text
Cliente
   ↓
Proxy
   ↓
Objeto real
```

Um Proxy pode, por exemplo:

* controlar acesso;
* fazer cache;
* realizar lazy loading;
* controlar acesso remoto;
* adicionar logging.

Enquanto uma Facade normalmente:

* simplifica uma API;
* coordena operações;
* reduz o conhecimento necessário do cliente.

---

# 17. Facade vs Mediator

Também existe uma relação interessante com o padrão **Mediator**.

### Facade

A comunicação normalmente acontece:

```text
Cliente
   ↓
Facade
   ↓
Subsistemas
```

A Facade fornece uma interface simplificada para o cliente.

### Mediator

O objetivo é reduzir a comunicação direta entre vários objetos:

```text
        A
        │
        ▼
        Mediator
       ↙       ↘
      B         C
```

O Mediator centraliza a comunicação entre objetos.

---

# 18. Quando utilizar Facade?

Facade pode ser interessante quando:

* um subsistema possui muitas classes;
* o cliente precisa executar várias operações para realizar uma ação;
* existe uma sequência complexa de operações;
* o cliente está muito acoplado às classes internas;
* você quer fornecer uma API mais simples;
* deseja esconder detalhes de implementação;
* existe um módulo complexo que será utilizado por vários clientes.

Exemplo:

```text
Sistema de pedidos
        ↓
    PedidoFacade
        ↓
 ┌──────┼────────┐
 ↓      ↓        ↓
Estoque Pagamento Frete
```

---

# 19. Quando não utilizar Facade?

Não é necessário criar uma Facade simplesmente porque existem várias classes.

Por exemplo:

```java
UserService userService =
        new UserService();

userService.findById(10);
```

Criar:

```java
UserFacade facade =
        new UserFacade();

facade.findUser(10);
```

apenas para delegar:

```java
return userService.findById(id);
```

pode adicionar uma camada sem trazer benefício real.

O padrão deve existir quando ele **simplifica o uso de um subsistema ou reduz acoplamento**, e não apenas porque "é um Design Pattern".

---

# 20. Vantagens

## 20.1 Redução do acoplamento

O cliente conhece menos classes internas.

```text
Antes:

Cliente → A
       → B
       → C
       → D

Depois:

Cliente → Facade → A
                 → B
                 → C
                 → D
```

---

## 20.2 API mais simples

O cliente pode executar uma operação complexa com uma chamada:

```java
facade.realizarPedido();
```

em vez de:

```java
estoque.verificar();
estoque.reservar();
pagamento.processar();
frete.calcular();
notificacao.enviar();
```

---

## 20.3 Centralização do fluxo

A sequência das operações fica concentrada em um único lugar.

```java
public void realizarPedido() {

    verificarEstoque();
    reservarProduto();
    processarPagamento();
    calcularFrete();
    enviarNotificacao();
}
```

---

## 20.4 Facilita mudanças internas

Se a implementação mudar:

```text
PagamentoService
```

for substituído por:

```text
NovoPagamentoService
```

o cliente pode continuar utilizando:

```java
facade.realizarPedido();
```

sem conhecer a alteração interna.

---

# 21. Desvantagens

Facade também pode ser mal utilizada.

## 21.1 Facade gigante

Uma Facade pode acabar acumulando responsabilidades demais:

```text
MegaFacade
 ├── usuário
 ├── pagamento
 ├── estoque
 ├── relatório
 ├── autenticação
 ├── email
 ├── logística
 └── auditoria
```

Isso pode criar uma classe difícil de manter.

---

## 21.2 Pode virar um God Object

Se todas as operações do sistema forem colocadas em uma única Facade:

```java
SistemaFacade
```

com dezenas ou centenas de métodos, provavelmente há um problema de design.

Pode ser melhor possuir várias Facades:

```text
PedidoFacade
PagamentoFacade
UsuarioFacade
RelatorioFacade
```

---

# 22. Facade e arquitetura em camadas

Em uma aplicação maior, podemos encontrar algo semelhante a:

```text
Controller
    ↓
Facade
    ↓
Services
    ↓
Repositories
    ↓
Database
```

Por exemplo:

```text
PedidoController
        ↓
PedidoFacade
        ↓
 ┌──────┼─────────┐
 ↓      ↓         ↓
Estoque Pagamento Frete
Service  Service  Service
```

Entretanto, **Facade não é uma camada arquitetural obrigatória**.

Ela é um **padrão de projeto**.

Uma arquitetura pode utilizá-la ou não dependendo das necessidades do sistema.

---

# 23. Exemplo mais próximo de uma aplicação real

Imagine:

```text
Pedido
 ├── Cliente
 ├── Produto
 ├── Pagamento
 └── Entrega
```

Para criar um pedido:

```java
public class PedidoFacade {

    private final ClienteService clienteService;
    private final EstoqueService estoqueService;
    private final PagamentoService pagamentoService;
    private final EntregaService entregaService;

    public PedidoFacade(
            ClienteService clienteService,
            EstoqueService estoqueService,
            PagamentoService pagamentoService,
            EntregaService entregaService) {

        this.clienteService = clienteService;
        this.estoqueService = estoqueService;
        this.pagamentoService = pagamentoService;
        this.entregaService = entregaService;
    }

    public void criarPedido(
            long clienteId,
            long produtoId,
            double valor) {

        clienteService.validar(clienteId);

        estoqueService.validarDisponibilidade(produtoId);

        pagamentoService.processar(valor);

        estoqueService.reservar(produtoId);

        entregaService.agendar(clienteId);
    }
}
```

O cliente:

```java
PedidoFacade facade =
        new PedidoFacade(
                clienteService,
                estoqueService,
                pagamentoService,
                entregaService
        );

facade.criarPedido(
        1L,
        10L,
        2500.00
);
```

A ideia central permanece:

```text
                   Cliente
                      │
                      ▼
                PedidoFacade
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      Cliente      Estoque     Pagamento
      Service      Service       Service
                      │
                      ▼
                  Entrega
                   Service
```

---

# 24. Como identificar o uso do Facade

Uma boa pergunta para fazer durante o projeto é:

> "O cliente precisa conhecer todos esses componentes para executar essa operação?"

Se a resposta for sim, pode existir uma oportunidade para Facade.

Por exemplo:

```java
estoque.verificar();
estoque.reservar();

pagamento.validar();
pagamento.processar();

frete.calcular();
frete.agendar();

notificacao.enviar();
```

Podemos perguntar:

> "Essas operações representam uma única ação do ponto de vista do cliente?"

Se sim:

```java
pedidoFacade.realizarPedido();
```

pode ser uma solução adequada.

---

# 25. Checklist

Antes de criar uma Facade, considere:

* [ ] Existe um subsistema complexo?
* [ ] O cliente precisa conhecer muitas classes?
* [ ] Existem várias operações que precisam ser executadas em conjunto?
* [ ] Existe uma sequência específica de operações?
* [ ] O cliente está muito acoplado às implementações internas?
* [ ] Uma interface simplificada ajudaria?
* [ ] A Facade terá uma responsabilidade clara?
* [ ] Ela não está se tornando uma God Class?

---

# 26. Resumo

O Facade é um padrão estrutural que fornece uma **interface simplificada para um subsistema complexo**.

### Sem Facade

```text
Cliente
 ├── Service A
 ├── Service B
 ├── Service C
 ├── Service D
 └── Service E
```

### Com Facade

```text
Cliente
   │
   ▼
Facade
   │
   ├── Service A
   ├── Service B
   ├── Service C
   ├── Service D
   └── Service E
```

A ideia fundamental pode ser resumida em:

> **"Não faça o cliente conhecer a complexidade que ele não precisa conhecer."**

O Facade não elimina a complexidade do sistema. Ele **centraliza e esconde essa complexidade atrás de uma interface mais simples**.

---

# 27. Conceito para memorizar

```text
Facade
   ↓
Simplifica
   ↓
um conjunto de classes
   ↓
fornecendo uma interface única
   ↓
para o cliente
```

Exemplo:

```java
PedidoFacade facade = new PedidoFacade();

facade.realizarPedido();
```

Por trás:

```text
realizarPedido()
       │
       ├── verificarEstoque()
       ├── reservarProduto()
       ├── processarPagamento()
       ├── calcularFrete()
       └── enviarNotificacao()
```

**Cliente vê:**

```java
facade.realizarPedido();
```

**Sistema executa:**

```text
Estoque
Pagamento
Frete
Notificação
...
```

Essa é a essência do padrão **Facade**.
