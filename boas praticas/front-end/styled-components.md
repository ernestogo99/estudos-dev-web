# styled-components- Convenções

## Estrutura de arquivo

- Somente **named exports** - nunca `export default`
- Nomes em **PascalCase** - `export const Container = styled.div`
- Um `styles.ts` por componente em pasta kebab-case

## Importação

```ts
// Sem css helper
import styled from "styled-components";

// com css helper

import styled, { css } from "styled-components";
```

## Helper `css` - quando usar

use `css`helper quando há **2+ interpolações** de `theme`no mesmo componente:

```ts
// css helper - limpo e agrupado

export const Card = styled.div`
  ${({ theme }) => css`
    padding: ${theme.sizes.spacings.medium};
    color: ${theme.colors.grey};
  `}
`;
```

Para **1 interpolação**, prop desestruturada direta é aceitavel:

```ts
export const Label = styled.span`
  color: ${(theme) => theme.colors.grey};
`;
```

## Estilos condicionais

```ts
export const Wrapper = styled.div<{ $disabled: boolean }>`
  display: flex;
  ${({ disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.3s;
      pointer-events: none;
    `}
`;
```

## Props customizadas -sempre prefixo `$` (transient props)

```ts
// Transient prop- Não vaza para o DOM
export const Button = styled.button<{ $enabled: boolean }>`
  color: ${({ $enabled, theme }) => `
       $enabled ? theme.colors.blueLink : theme.colors.grey40 
    `};
`;
```

## Extenção de componentes de biblioteca

```ts
import { TextField } from "lib";

export const CustomTextField = styled(TextField)<{ $highlighted: boolean }>`
  border-left: 4px solid
    ${({ $highlighted, theme }) =>
      $highlighted ? theme.colors.mountainMeadow : "transparent"};
`;
```
