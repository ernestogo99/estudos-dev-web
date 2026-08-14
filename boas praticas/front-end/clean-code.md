## Clean code - React + Typescript

## Princípios

- **SRP**: cada função/componente faz uma coisa
- **DRY**: extraia duplicatas
- **KISS**: solução mais simples que funciona
- **YAGNI**: não construa o que não foi pedido
- **Pureza**: componente React são funções puras - mesmas props, mesmo JSX

## Naming

| Elemento    | Convenção                | Exemplo                                 |
| ----------- | ------------------------ | --------------------------------------- |
| Componentes | PascalCase, named export | `export const BalanceCard=()=>{}`       |
| Hooks       | camelCase com `use`      | `export const useBalance = ()=> {} `    |
| Pastas      | kebab-case               | `balance-card/`                         |
| Booleans    | Interrogativo            | `isLoading`, `hasPermission`, `canEdit` |
| Funções     | Verbo + substantivo      | `handleSubmitForm()`                    |

## Funções

- Max 20 linhas, ideal 5-10
- Max 3 argumentos (preferir 0-2)
- Guard clauses para early returns
- Max 2 níveis de nesting

## React

### Estado derivado - calcular, não sincronizar

```typescript
// certo: calculado no render
const fullName = firstName + " " + lastName;
const visibleTodos = showActive ? todos.filter((t) => !t.completed) : todos;

// errado: estado redundante + useEffect
const [fullName, setFullName] = useState("");
useEffect(() => setFullName(firstName + " " + lastName), [fistName, LastName]);
```

### useEffect - apenas para sistemas externos

```typescript
// certo: sincronizar com sistema externo

useEffect(() => {
  const conn = createConnection(roomId);
  conn.connect();
  return () => conn.disconnect();
}, [roomId]);

//errado: lógica de evento

useEffect(() => {
  if (product.isInCart) SshowNotification("Adicionado");
}, [product]);

//certo : no event handler

const handleAdd = () => {
  addToCart(product);
  showNotification("Adicionado");
};
```

### Performance - memoização quando necessário

- `React.memo` - componente re-renderiza frequentemente com mesmas props
- `useMemo` - cálculo caro que depende de props
- `useCallback`- função passada como prop para componente memoizado
- Não usar preventivamente

### Listas - key estável

```ts
//certo: id único
{orders.map(order=><OrderCard key={order.id} order=order />)}

//errado: index
{orders.map((order,i)=> <OrDerCard key={i} order={order} />)}
```

### Typescript

- Nunca `any` - criar interface/type para tudo
- Props -> `interface ComponentNameProps{}`
- Unions -> `type Status =  'active'|'inactive' `
- Name exports - nunca `export default`(exceto lazy routes)
- Path alias: `~/ = `src/`
