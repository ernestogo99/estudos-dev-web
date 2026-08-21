# Conveções de projetos

## Arquiteturas possíveis

| Estrutura    | localização                                   |
| ------------ | --------------------------------------------- |
| clássica     | `src/pages/`, `src/services`, `src/contexts/` |
| Feature-base | `src/features/[feature-name]/`                |

### Stack

| Lib                  | Uso                                      |
| -------------------- | ---------------------------------------- |
| React                | UI (functional components + hooks)       |
| TypeScript           | Tipagem estrita                          |
| Material UI          | Componentes e estilização da interface   |
| React Router DOM     | Roteamento e navegação                   |
| TanStack React Query | Gerenciamento de estado assíncrono/cache |
| Axios                | Requisições HTTP                         |
| React Hook Form      | Gerenciamento e validação de formulários |
| MSW                  | Mock de APIs para desenvolvimento/testes |
| Zod                  | Validação e definição de schemas         |
| date-fns             | Manipulação e formatação de datas        |
| React Hot Toast      | Notificações e feedback ao usuário       |

## Estrutura de features

```
src/features/[feature-name]/
   api/
     handlers.ts
     [endpoint]/
        types.ts
        axios.ts
        mock.ts
        msw.ts
        queryClient.ts | mutationClient.ts
    components/
        [component]/
            index.tsx
            styles.tsx  (opcional)
            test.tsx
    hooks/
        [use-hook]/
            index.tsx
            test.tsx
    routes/
        index.ts
```

Cada feature será um módulo, também teremos as pastas globais, como components e layouts

```
src/
├── features/
│   ├── auth/
│   ├── users/
│   └── products/
│
├── components/
├── hooks/
├── layouts/
├── routes/
├── services/
└── utils/
```

## Estrutura clássica

```
/my-react-app
│── /public
│
│── /src
│   ├── /assets         # Imagens, ícones, estilos globais, fontes etc.
│   ├── /pages          # Páginas principais da aplicação
│   ├── /routes         # Configuração das rotas da aplicação
│   ├── /shared         # Recursos compartilhados
│   │   ├── /components # Componentes reutilizáveis (botões, tabelas, inputs, etc.)
│   │   ├── /contexts   # Contextos do React (Context API)
│   │
│   │   ├── /interfaces # Tipagens e interfaces TypeScript
│   │   ├── /layout     # Layouts padrão (ex: com menu lateral, cabeçalho etc.)
│   │   ├── /services   # Serviços de API, requisições HTTP etc.
│   │   ├── /themes     # Temas e estilos personalizados (ex: MUI Theme)
│
│   ├── App.tsx         # Componente principal da aplicação
│   ├── main.tsx        # Ponto de entrada do React
│   ├── vite.config.ts  # Configuração do Vite (se estiver usando Vite)
│
│── package.json
│── tsconfig.json       # Configuração do TypeScript
│── .eslintrc.js        # Configuração do ESLint
│── .gitignore

```

## Validação ao finalizar

1. `npm run lint`- zero erros
2. `npm run dev`- projeto inicia sem erros
3. `npm run test`- testes passam
