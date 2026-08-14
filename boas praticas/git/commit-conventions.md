# Convenção de commits

## Formato

```
<tipo>(<escopo opcional>): <descrição em português, imperativo, lowercase, sem ponto final>
```

Header: max 100 caracteres

## Tipos aceitos

| Tipo       | Quando                                   |
| ---------- | ---------------------------------------- |
| `feat`     | Nova funcionalidade                      |
| `fix`      | Correção de bug                          |
| `refactor` | Refatoração sem mudança de comportamento |
| `perf`     | Melhoria de performance                  |
| `style`    | Formatação, se mudança de código         |
| `test`     | testes                                   |
| `docs`     | Documentação                             |
| `build`    | Builds system, deps                      |
| `ci`       | Pipeline                                 |
| `chore`    | Manutenção                               |

## Exemplos

```
feat(dashboard): adicionar card de saldo total
fix(requests): corrigir tratamento de erro para cliente funcionario
refactor: extrair hook de filtro para reutilização
test: adicionar testes do componente balance-summary
```

## Regras

- Português na descrição
- Imperativo: "adicionar" , não "adicionado"
- Sem maiúscula no início
- Sem ponto final
- Sem emojis
