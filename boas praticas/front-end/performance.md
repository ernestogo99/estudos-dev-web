# Perfomance Web - Core Web Vitals + Bundle optimization

## Métricas-Alvo (Core Web Vitals)

| Métrica                  | Bom     | Precisa Melhorar | Ruim    |
| ------------------------ | ------- | ---------------- | ------- |
| **LCP** (carregamento)   | <=2,5s  | 2,5s - 4         | >4s     |
| **INP** (interatividade) | <=200ms | 200ms - 500ms    | > 500ms |
| **CLS** (estabilidade)   | <-0,1   | 0,1-0,25         | > 0,25  |

## LCP - Quick Fixes

```html
<!---- Image LCP: preload + alta prioridade -->

<link rel="preload" href="/hero.webp" as="image" fetchpriority="high" />
<img
  src="hero.webp"
  alt="Hero"
  fetchpriority="high"
  width="1200"
  height="600"
/>
```

- CSS crítico inline(< 14KB)
- Fontes com `font-display:swap`
- Sem JS bloqueador no `<head>`

## INP - React

```ts
// useTransition para atualizações não urgentes
const [isPending, startTransition] = useTransition();
startTransition(() => setResultadosFiltrados(filtrar(value)));

// React.memo em componentes pesados

const ItemLista=React.memo(({item})=> <div>{item.nome}</div>)


// dividir tasks longas

async function processarLista(items){
    const CHUNK=100
    for(let i=0;i<items.length;i+=CHUNK>){
        items.slice(i,i+CHUNK).forEach(operacaoPesada);
        await new Promise(r=>setTimeout(r,0)) // yield
    }
}
```

## CLS - Prevenir layout shifts

- Todas as imagens com `width`/`height` ou `aspect-ratio`
- Conteúdo dinâmico inserido abaixo do viewport
- Animações usam `transform`/ `opacity` apenas
- Fontes com `font-display: optional`

## Bundle - Code Splitting

```tsx
const DashBoard = lazy(() => import("./Dashboard"));

<Suspense fallback={<Skeleton>/}>
 <DashBoard/>
</Suspense>

```

### Module Federation - shared dependencies

```js
shared:{
    react{singleton:true,eager:true},
    'react-dom':{singleton:true,eager,true},
    '@tanstack/react-query': {singleton:true}
}

```
