# React query

TanStack Query (anteriormente conhecido como React Query) é frequentemente descrito como a biblioteca de busca de dados que faltava para aplicações web, mas, em termos mais técnicos, ele torna muito mais simples o processo de buscar, armazenar em cache, sincronizar e atualizar o estado do servidor nas suas aplicações web.

é uma biblioteca para gerenciar dados assíncronos no frontend, principalmente dados que vêm de uma API.

ELa não substitui axios e não faz requisições http diretamente, a divisão é:

- Axios: executa a requisição http
- React Query: Controla quando executar cache, loading,erro, atualização e sincronização dos dados
- Componente: Apenas apresenta o resultado

Sem react query seria comum escrever:

```tsx
const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

useEffct(() => {
  setIsloading(true);

  axios
    .get("/teste")
    .then((response) => setData(response.data))
    .catch(setError)
    .finally(() => setIsLoading(false));
}, []);
```

com react query:

```ts
const { data, isLoading, isError } = useQuery({
  queryKey: ["key"],
  queryFn: fetchConciliation,
});
```

A biblioteca passa a administrar:

- cache
- estados de carregamento e erro
- reutilização dos dados entre componentes
- atualização automática
- refetch
- tentativas em caso de erro
- invalidação do cache após alterações

## Queries e mutations

Existem dois hooks principais

**useQuery**

usado para consultar dados, normalmente em operações get

```ts
const query = useQuery({
  queryKey: ["customers", customerId],
  queryFn: () => getCustomer(customerId),
});
```

a querykey identifica os dados dentro do cache. Nesse caso, clientes diferentes terão caches diferentes

```ts
["customers", 10][("customers", 20)];
```

o resultado contém informações como

```ts
query.data;
query.isLoading;
query.isError;
query.isFetching;
query.refetch();
```

**useMutation**

Usado para operações que alteram dados, como Post,put,patch e delete

```ts
const mutation = useMutation({
  mutationFn: createCustomer,
});
```

pode executar:

```ts
mutation.mutate(customerData);
```

o resultado também oferece estados

```ts
mutation.isPending;
mutation.isError;
mutation.isSucess;
```

como uma mutation pode deixar dados em cache desatualizados, normalmente ela invalida as queries relacionadas

## Exemplos

```ts
export const MY_KEY = "key";

export const useGetConciliation = (params: getConciliationParams) => {
  return useQuery({
    queryKey: [MY_KEY, params],
    queryFn: async () => {
      const { data } = await getConciliation(params);
      return data;
    },
    enabled: !!params.date,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
};
```

- queryKey: o cache é identificado pelos parâmetros de consulta
- queryFn: executa a função do arquivo de axios e coloca a resposta no cache
- enabled: a consulta só é executada quando date está preenchido
- refetchOnWindowFocus(false): impede que a chamada seja refeita quando o usuário sai e volta para a aba do navegador
- staleTime(0): sobrescreve os 60 segundos globais Os dados dessa consulta são considerados desatualizados imediatamente, permitindo que sejam atualizados com mais frequência

```ts
export const useStartConciliation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) =>
      startConciliation(params).then((response) => response.data),

    onSucess: () => {
      toast.sucess("sucesso");

      queryClient.invalidateQueries({
        queryKey: [MY_KEY],
      });

      queryClient.invalidateQueris({
        queryKey: [MY_ITEMS_KEY],
      });
    },

    onError: () => {
      toast.error("erro");
    },
  });
};
```
