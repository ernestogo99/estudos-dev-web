# API service - convenções

## Estrutura do módulo de api

| Arquivo             | Obrigatório | Propósito                              |
| ------------------- | ----------- | -------------------------------------- |
| `types.ts`          | Sempre      | Interfaces Request/Response            |
| `axios.ts`          | Sempre      | Função http cliente                    |
| `mock.ts`           | Sempre      | dados mock estáticos                   |
| `msw.ts`            | sempre      | handler msw para dev                   |
| `queryclient.ts`    |             | GET hook usequery                      |
| `mutationclient.ts` |             | POST/PUT/PATCH/DELETE hook usemutation |

## React query

```typescript
//queryClient.ts -GET
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./axios";

export const useMyData = (params: Params) => {
  useQuery({
    queryKey: ["feature", "endpoint", params],
    queryFn: () => fetchData(params),
    enabled: !!params.id,
  });
};
```

```typescript
//mutationclient.ts - post/put/delete

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "./axios";

export const useMyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postData,
    onSucess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature"] });
    },
  });
};
```

## Axios service

```typescript
import { httpClient } from "./config";
import { MyRequest, MyResponse } from "./types";

export const fetchMyData = async (params: Myquest): Promise<MyResponse> => {
  const { data } = await httpclient.get<MyResponse>("/endpoint", { params });
  return data;
};
```

## MSW handler

```typescript
import { rest } from "msw";
import { mockData } from "./mock";

const isError = () => sessionStorage.getItem("isError") === "true";

export const myHandler =rest.get(*/endpoint,(req,res,ctx)=>{
    if(isError()) return res(ctx.status(500))
    return res(ctx.json(mockData))
})

```

## handlers.ts da feature

```typescript
import { myHandler } from "./get-my-data/msw";
import { myMutationHandler } from "./post-my-data/msw";

export const myFeatureHandlers = [myHandler, myMutationHandler];
```

## NUNCA

- `useEffect` + `useState`para fetch de dados
- Positional syntax: `useQuery(['key'],fn)` - usar object syntax
