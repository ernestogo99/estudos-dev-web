# Custom Hooks Patterns - Logica do componente em hooks colocados

> O componente (`index.tsx`) renderiza. a logica(estado,handlers,permissao,navegacao,requests) vive em hooks customizados.

## Quando extrair

- Permissionamento(`useAuth` + `toHavePermission`) -> `use[Componente]Permission`
- Fetch/mutation (React query) -> `use[Componente]Request` / `Requests`
- Multiplos `useState` + Formatadores + navegação -> `use[Componente]`(orquestrador)
- Heuristica: mais de 5 linhas de logica entre a declaração e o `return`, ou qualquer permissionamento/request -> extrair

## Estrutura e nomes

```text
components/[componente]/
    index.tsx # só JSX - consomes o hooks
    hooks/
        use-[componente]/     # pasta kebab-case
            index.tsx         # export const useComponente = () => (camelcase)
            test.tsx
```

## Proibido

- Concentrar estados, handlers, permissionamento ou requests no `index.tsx`do componente.
- `useEffect` + `useState` para fetch - usar React Query dentro do hook.
