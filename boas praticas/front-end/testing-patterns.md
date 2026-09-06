# Testing patterns - Jest + testing library

## Custom render - Obrigatório

```tsx
import { ReactElement } from "react";

import { BrowserRouter } from "react-router-dom";
import { render, RenderResult } from "@testing-library/react";

import { ThemeProvider } from "@mui/material/styles";

import { QueryClient, QueryClientProvider } from "react-query";

import { theme } from "@/styles/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: Infinity,
      staleTime: 0,
    },
  },
});

const customRender = (component: ReactElement): RenderResult => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true }}>
        <ThemeProvider theme={theme}>{component}</ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>,
  );
};

export * from "@testing-library/react";
export { customRender as render };
```

Sempre importar de `~/utils/test`, nunca de `@testing-library/react`

```ts
import { render, screen } from "~/utils/test"; //componente simples
import { renderWithQueryProvider as render } from "~/utils/test";
import { waitFor } from "~/utils/test";
```

## Padrão `makeSut` - Obrigatório

Todo testa usa `makeSut` . Nunca chamar render direto no `it()`

```ts
import { render, screen } from "~/utils/test";
import userEvent from "~/utils/test";
import { Meucomponente } from "/";

const DEFAULT_PROPS:MeuComponentsProps={
    tittle:'Titulo'
    onSubmit:jest.fn(),
}

const makeSut=(props:MeucomponenteProps=DEFAULT_PROPS)=>{
    const user=userEvent.setup()
    const sut=render(<Meucomponente {...props}/>);
    return {...sut,user};
}

```

## Queries - prioridade

1. `getByRole('button',{name:/buscar/i})` - SEMPRE preferido
2. `getByLabelText('Nome')` - Inputs com label
3. `getByText('Titulo')` - Textos visiveis
4. `getByPlaceHolderText('cpf')` - inputs sem label
5. `queryBy*` - quando pode NÃO existir
6. `findBy*` - aguardar aparecer (async)
7. `getByTestId` - **ÚLTIMO RECURSO** - apenas em mocks de filhos

## Interação - userEvent(Preferido)

```ts
it("should click button", async () => {
  const { user } = makeSut();
  await user.click(screen.getByRole("button", { name: /buscar/i }));
});
```

## Mock de hook customizado

```ts
jest.mock("./hooks/use-my-hook");
const mockUseMyHook = useMyhook as jest.MockedFunction<typeof useMyHook>;

const buildHookReturn = (overrides = {}) => ({
  data: [],
  isLoading: false,
  isError: false,
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  mockUseMyHook.mockReturnValue(buildHookReturn());
});
```

## React query - renderHook

```tsx
import { renderHook, waitFor } from "~/utils/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const makeSut = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });

  const wrapper = ({ children }): { children: React.ReactNode } => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(() => useMyhook(), { wrapper });
};
```

## Regras

- `it()` sempre em **inglês**: `it('should render correctly')`
- Sem comentarios no teste
- Sem `any` -tipar mocks e fixtures
- `jest.clearAllMocks()` no `beforeEach`
- `jest.restoreAllMocks()` no `afterEach` com `jest.spyOn`
- `data-testid` apenas em mocks de filhos, nunca em componentes reais
