# Material UI

É uma biblioteca de componentes que implementa o design material do google
ela nos permite usar componentes prontos para desenvolver interfaces rapidamente


# Typography

É um componente do MUI usado para exibir texto com estilos tipográficos predefinidos (títulos, subtítulos, parágrafos etc).

possui a prop variant, que define o tipo de texto que veremos visualmente

variants disponíveis:
- h1, h2, ..., h6 – Títulos

- subtitle1, subtitle2 – Subtítulos

- body1, body2 – Texto normal

- caption – Pequeno

- overline – Texto com linha superior

- button – Texto de botão


a prop component muda a tag html que será renderizada, sem mudar o estilo visual


ex:

```tsx
    <Typography variant="h6" component='h1'>h6 header</Typography>
```

# Box

O Box é um componente genérico de layout. Ele funciona como uma div com superpoderes: aceita props para margin, padding, display, background, cor, alinhamento, etc.


```tsx
<Box padding={10} flex>
  Conteúdo aqui
</Box>
```

# Stack

O Stack é um componente de layout vertical ou horizontal. Ele empilha seus filhos com espaçamento automático, funcionando como um flexbox com configuração simples.

```tsx
<Stack spacing={2} direction="row">
  <Button>Botão 1</Button>
  <Button>Botão 2</Button>
</Stack>

```

# Button

O Button é um componente estilizado e acessível usado para representar ações clicáveis em uma interface. Ele vem com estilos prontos e responsivos que seguem o Material Design.

a prop variant define a aparência do botão

variantes disponíveis:

- text: Botão só com texto, sem borda nem fundo. É o padrão.
- outLined: Botão com borda e sem fundo. Mais discreto.
- contained: Botão com fundo preenchido. Mais visível.

a prop color define as cores do button

cores disponíveis:

- primary: cor principal do tema(padrão é azul)
- secondary: cor secundário do tema (padrão é roxo)
- error: vermelho
- info: azul claro
- sucess: verde
- warning: laranja
- inherit: herda a cor do pai

a prop size define o tamanho do 

tamanhos disponíveis:

- small: pequeno
- medium: médio
- large: grande

a prop endIcon coloca um icone ao final do texto do botão e 
a prop startIcon coloca um icone no início do botão

se queremos que um ícone funcione como um botão, utilizamos o componente iconButton



```tsx
        <Stack spacing={4}>
            <Stack spacing={2} direction='row'>
             <Button variant="text" href="google.com">MuiButton</Button>
             <Button variant="contained">Contained</Button>
            <Button variant="outlined">OutLined</Button>
            
            </Stack>

            <Stack spacing={2} direction='row'>
                    <Button variant="contained" color="primary">primary</Button>
                     <Button variant="outlined" color="secondary">secondary</Button>
                      <Button variant="contained" color="error">error</Button>
                       <Button variant="contained" color="info">info</Button>
                        <Button variant="contained" color="warning">warning</Button>
                         <Button variant="contained" color="inherit">inherit</Button>
                          <Button variant="contained" color="success">sucess</Button>
            </Stack>

            <Stack display='block' spacing={2} direction='row'>
                 <Button variant="contained" size="small" color="primary">small</Button>
                  <Button variant="contained" size="medium" color="primary">medium</Button>
                   <Button variant="contained" size="large" color="primary">large</Button>
            </Stack>

            <Stack spacing={2} direction='row'>
                <Button variant="contained" startIcon={<Facebook/>} disableRipple color="primary">large</Button>
                  <Button variant="contained" size="large" onClick={()=>window.alert("oi")} disableElevation endIcon={<X/>} color="primary">large</Button>
                  <IconButton aria-label="facebook"><Facebook/></IconButton>
            </Stack>
            </Stack>
```




# Group Buttons


É um container que agrupa múltiplos Buttons. Ele garante que os botões:

- Fiquem juntos visualmente

- Compartilhem estilo consistente

- Se comportem como uma única unidade de ação, quando necessário


props:

- variant: define o estilo dos botões
- color: define a cor dos botões
- orientation: horizontal(padrão) ou vertical
- disableElevation: Remove sombra dos botões contained
- size: tamanho dos botões


```tsx
   <Stack direction='row'>
    <ButtonGroup aria-label="alignment button group" variant="outlined" orientation="vertical" size="small" color="secondary">
        <Button onClick={()=>window.alert("left click")}>Left</Button>
         <Button>Center</Button>
          <Button>Right</Button>
    </ButtonGroup>
    </Stack>
```