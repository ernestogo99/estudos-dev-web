# MUI `styled` — Convenções

## Estrutura de arquivo

- Utilizar somente **named exports** — nunca `export default`.
- Nomes dos componentes estilizados em **PascalCase**.
- Criar um `styles.ts` para cada componente que possua estilos próprios.
- Utilizar pastas em **kebab-case**.
- Utilizar `styled` exclusivamente para **customizar componentes do Material UI**.

### Exemplo

```text
components/
└── custom-button/
    ├── CustomButton.tsx
    └── styles.ts
```

```ts
// styles.ts

import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  textTransform: "none",
}));
```

---

## Hierarquia de decisão

Antes de utilizar `styled` ou `sx`, verificar se o próprio componente MUI já possui uma **prop ou API específica** que resolva o problema.

A preferência deve ser:

```text
1. Props nativas do componente MUI
          ↓
2. sx
          ↓
3. styled
```

### 1. Props nativas do MUI

Quando o componente já possui uma prop que representa a necessidade, **preferir a prop nativa**.

```tsx
<Button variant="contained" color="primary" size="small">
  Salvar
</Button>
```

Em vez de:

```tsx
<Button
  sx={{
    backgroundColor: "primary.main",
    padding: "4px 8px",
  }}
>
  Salvar
</Button>
```

O mesmo princípio vale para outros componentes:

```tsx
<TextField variant="outlined" size="small" fullWidth />
```

```tsx
<Dialog fullWidth maxWidth="md">
  ...
</Dialog>
```

```tsx
<Typography variant="h6" align="center">
  Título
</Typography>
```

```tsx
<Stack direction="row" spacing={2}>
  ...
</Stack>
```

### Regra

> **Se o MUI já possui uma prop específica para a necessidade, utilizar a prop em vez de reproduzir seu comportamento com `sx` ou `styled`.**

---

## Quando utilizar `sx`

Utilizar `sx` quando:

- O componente MUI não possui uma prop específica para aquele estilo.
- A customização é pequena.
- O estilo é específico daquele uso.
- Não existe necessidade de reutilização.
- A alteração não representa uma nova variante do componente.

```tsx
<Button
  sx={{
    mt: 2,
    width: "100%",
  }}
>
  Salvar
</Button>
```

Outro exemplo:

```tsx
<Card
  sx={{
    p: 2,
    borderRadius: 2,
  }}
>
  ...
</Card>
```

### Regra

> **`sx` é preferível para customizações locais e pontuais.**

---

## Quando utilizar `styled`

Utilizar `styled` quando:

- O componente customizado será reutilizado.
- O estilo representa uma nova variante ou identidade visual.
- Existem várias regras de estilo relacionadas.
- Existem estados visuais próprios.
- Existem regras responsivas próprias.
- É necessário estilizar elementos internos do componente MUI.
- O conjunto de estilos representa um padrão da aplicação.

```ts
export const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  textTransform: "none",

  "&:hover": {
    transform: "translateY(-1px)",
  },
}));
```

Uso:

```tsx
<CustomButton>Salvar</CustomButton>
```

### Regra

> **`styled` deve ser utilizado para criar componentes MUI customizados e reutilizáveis, e não apenas para substituir um `sx` pontual.**

---

## Exemplo de decisão

Imagine que precisamos de um botão menor.

### ❌ Não criar `styled` imediatamente

```ts
export const SmallButton = styled(Button)({
  padding: "4px 8px",
});
```

Primeiro verificar se o MUI já possui:

```tsx
<Button size="small">Salvar</Button>
```

Nesse caso, a prop nativa é a melhor opção.

---

### ❌ Não utilizar `sx` quando existe uma prop nativa

Evitar:

```tsx
<Button
  sx={{
    textTransform: "none",
  }}
>
  Salvar
</Button>
```

Se a configuração puder ser definida como parte de um padrão global do componente, avaliar o tema ou uma variante do MUI.

---

### ✅ Utilizar `sx` para uma necessidade local

```tsx
<Button
  sx={{
    mt: 2,
    width: "100%",
  }}
>
  Salvar
</Button>
```

Não há necessidade de criar um componente apenas para isso.

---

### ✅ Utilizar `styled` para uma variante reutilizável

```ts
export const PrimaryActionButton = styled(Button)(({ theme }) => ({
  minWidth: 160,
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  textTransform: "none",

  "&:hover": {
    transform: "translateY(-1px)",
  },
}));
```

Nesse caso existe uma identidade visual própria e reutilizável.

---

## Importação

O `styled` deve ser importado de:

```ts
import { styled } from "@mui/material/styles";
```

O componente base deve ser importado de `@mui/material`:

```ts
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
```

Não utilizar `styled-components`:

```ts
import styled from "styled-components";
```

---

## Nomeação

Os componentes estilizados devem utilizar **PascalCase**:

```ts
export const CustomButton = styled(Button)(...);

export const CustomTextField = styled(TextField)(...);

export const ConfirmationDialog = styled(Dialog)(...);
```

O nome deve representar claramente a finalidade do componente:

```ts
export const PrimaryActionButton = styled(Button)(...);

export const CompactTextField = styled(TextField)(...);

export const ConfirmationDialog = styled(Dialog)(...);
```

---

## Theme

Preferir valores provenientes do `theme` quando houver um valor equivalente.

```ts
export const CustomButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));
```

Preferir:

```ts
theme.spacing(2);
theme.palette.primary.main;
theme.palette.text.primary;
theme.palette.background.paper;
theme.shape.borderRadius;
theme.breakpoints.up("md");
```

Em vez de valores fixos quando esses valores já fazem parte do tema.

---

## Estilos condicionais

Utilizar props customizadas para representar estados visuais específicos do componente.

```ts
export const CustomButton = styled(Button)<{
  $highlighted: boolean;
}>(({ $highlighted, theme }) => ({
  color: $highlighted ? theme.palette.primary.main : theme.palette.text.primary,
}));
```

Para uma única propriedade condicional, preferir ternário:

```ts
color: $active
  ? theme.palette.primary.main
  : theme.palette.text.secondary,
```

Para múltiplas propriedades:

```ts
export const CustomButton = styled(Button)<{
  $highlighted: boolean;
}>(({ $highlighted, theme }) => ({
  ...($highlighted && {
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.action.hover,
    fontWeight: 600,
  }),
}));
```

---

## Props customizadas

Props utilizadas exclusivamente para controlar estilos devem utilizar o prefixo `$`.

```ts
export const CustomButton = styled(Button)<{
  $highlighted: boolean;
  $compact: boolean;
}>(({ $highlighted, $compact, theme }) => ({
  padding: $compact ? theme.spacing(0.5, 1) : theme.spacing(1, 2),

  color: $highlighted ? theme.palette.primary.main : theme.palette.text.primary,
}));
```

Exemplos:

```text
$active
$selected
$highlighted
$compact
$fullWidth
$loading
```

### Regra

> Toda prop criada exclusivamente para alterar estilos deve utilizar o prefixo `$`.

---

## Extensão de componentes MUI

Utilizar `styled` para criar versões customizadas e reutilizáveis dos componentes MUI.

```ts
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
  },
}));
```

---

## Estilização de elementos internos

Para estilizar elementos internos dos componentes MUI, utilizar `&` juntamente com as classes fornecidas pelo MUI.

```ts
export const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
  },

  "& .MuiOutlinedInput-input": {
    padding: theme.spacing(1.5),
  },

  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
  },
}));
```

### `&`

O `&` representa o próprio componente estilizado.

```ts
"&:hover": {
  ...
}
```

Representa:

```text
CustomButton:hover
```

Enquanto:

```ts
"& .MuiOutlinedInput-root": {
  ...
}
```

representa:

```text
CustomTextField .MuiOutlinedInput-root
```

---

## Estados dos componentes MUI

Para pseudo-classes:

```ts
export const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,

  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },

  "&:active": {
    transform: "scale(0.98)",
  },

  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
  },
}));
```

Para estados específicos do MUI:

```ts
export const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },

  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
  },
}));
```

---

## `css` helper

Não utilizar o `css` helper do `styled-components`.

O MUI `styled` utiliza objetos de estilo:

```ts
export const CustomCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));
```

Mesmo quando várias propriedades utilizam o `theme`, mantê-las diretamente no objeto:

```ts
export const CustomCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));
```

---

## Responsividade

Utilizar os breakpoints definidos no `theme`:

```ts
export const CustomCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),

  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
  },

  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(4),
  },
}));
```

---

## `shouldForwardProp`

Quando for necessário impedir explicitamente que uma prop seja encaminhada ao componente base, utilizar `shouldForwardProp`.

```ts
export const CustomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "highlighted",
})<{
  highlighted: boolean;
}>(({ highlighted, theme }) => ({
  color: highlighted ? theme.palette.primary.main : theme.palette.text.primary,
}));
```

Entretanto, para props exclusivamente relacionadas à estilização, preferir:

```ts
export const CustomButton = styled(Button)<{
  $highlighted: boolean;
}>(({ $highlighted, theme }) => ({
  color: $highlighted ? theme.palette.primary.main : theme.palette.text.primary,
}));
```

### Regra

> Preferir `$prop` para props de estilo. Utilizar `shouldForwardProp` quando houver uma necessidade específica de controlar o encaminhamento da propriedade.

---

## Resumo da estratégia

```text
A necessidade é suportada por uma prop nativa do MUI?
                │
               SIM
                ↓
        Utilizar a prop do MUI
                │
               NÃO
                ↓
A customização é pequena e específica desse uso?
                │
               SIM
                ↓
             Utilizar sx
                │
               NÃO
                ↓
É uma customização reutilizável/uma nova variante?
                │
               SIM
                ↓
          Utilizar styled
```

### Exemplo

```tsx
// 1. Prop nativa
<Button variant="contained" size="small" color="primary">
  Salvar
</Button>
```

```tsx
// 2. sx — customização local
<Button
  sx={{
    width: "100%",
    mt: 2,
  }}
>
  Salvar
</Button>
```

```ts
// 3. styled — componente reutilizável
export const PrimaryActionButton = styled(Button)(({ theme }) => ({
  minWidth: 160,
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  textTransform: "none",

  "&:hover": {
    transform: "translateY(-1px)",
  },
}));
```

---

## Resumo das convenções

| Item                 | Convenção                  |
| -------------------- | -------------------------- |
| Componentes base     | Componentes do MUI         |
| `styled`             | `@mui/material/styles`     |
| Export               | Named exports              |
| Nome                 | PascalCase                 |
| Arquivo              | `styles.ts`                |
| Pasta                | kebab-case                 |
| 1ª preferência       | Props nativas do MUI       |
| 2ª preferência       | `sx`                       |
| 3ª preferência       | `styled`                   |
| Props de estilo      | Prefixo `$`                |
| Theme                | `({ theme }) => ({ ... })` |
| Condicional simples  | Ternário                   |
| Condicional múltiplo | Spread condicional         |
| Estados              | `&:hover`, `&:focus`, etc. |
| Elementos internos   | `& .Mui...`                |
| Responsividade       | `theme.breakpoints`        |
| `css` helper         | Não utilizar               |
| `shouldForwardProp`  | Utilizar quando necessário |
