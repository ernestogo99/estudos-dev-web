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


# Toggle button

É um botão que mantém estado (pressionado ou não). Pode ser usado sozinho ou em conjunto com o ToggleButtonGroup para seleção única ou múltipla.

a prop exclusive do toggleButtonGroup permite selecionar apenas um botão de cada vez

ex:

```tsx
const MuiToggleButton=()=>{
    const [formats,setFormats]=useState<string[]>([])
    // utilizamos quando usamos a prop exclusive const [format,setFormat]=useState<string | null>(null)
    console.log({
        formats,
    })

    const handleFormatChange=(event:React.MouseEvent<HTMLElement>,updatedFormats:string[])=>{
        setFormats(updatedFormats)
    }

    return(
        <Stack> 
            <ToggleButtonGroup exclusive size="small" color="secondary" orientation="vertical" aria-label="text-formating" value={formats} onChange={handleFormatChange}>
            <ToggleButton value='bold' aria-label="bold"><FormatBold></FormatBold> </ToggleButton>
            <ToggleButton value='italic' aria-label="italic"><FormatItalic></FormatItalic></ToggleButton>
            <ToggleButton value='underlined' aria-label="underlined"><FormatUnderlined></FormatUnderlined></ToggleButton>
        </ToggleButtonGroup></Stack>
       
    )
}


export default MuiToggleButton
```

# Textfield

é o componente do Material UI usado para criar campos de entrada de texto, como inputs de formulários — por exemplo: nome, e-mail, senha, busca, etc.


props:

- label: Rótulo do campo (fica flutuante quando preenchido)
- variant: estilo visual(outLined, Filled,standard)
- type: tipo do input(email,password,text,etc)
- value/Onchange: controle do valor
- error: Marca como erro(visual vermelho)
- helperText: texto auxiliar abaixo do campo
- disabled: desativa o campo
- required: Adiciona * visual e semântica de obrigatório
- multiline: transforma em textarea
- size: small ou medium
- fullwidth: faz o campo ocupar 100% da largura disponível


```tsx
import { Stack, TextField, InputAdornment } from "@mui/material";
import { useState } from "react";

const MaterialTextField = () => {
    const [name,setName]=useState('')

  return (
    <Stack spacing={4}>
      <Stack direction="row" spacing={2}>
        <TextField label="name" value={name} onChange={(e)=>setName(e.target.value)} error={!name} helperText={!name? 'Required':'be careful with your informations'} variant="outlined" />
        <TextField label="filled" variant="filled" />
        <TextField label="standard" variant="standard" />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField label="small" size="small" variant="outlined" />
        <TextField label="medium" size="medium" variant="filled" />
        <TextField label="name" variant="standard" />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField label="form-input" required error variant="outlined" />
        <TextField
          label="form-input"
          disabled
          helperText="do not share your password with anyone"
          variant="filled"
        />
        <TextField label="password" type="password" variant="standard" />
        <TextField
          label="readonly"
          type="text"
          variant="standard"
          slotProps={{ input: { readOnly: true } }}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          label="amount"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          label="weight"
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default MaterialTextField;

```



# Select

É o componente usado para criar dropdowns em formulários,
ele possui suporte para seleção única ou múltipla, integração com textfield,
adornos,erros,helpertext, etc

props:

- value: valor selecionado(estado controlado)
- onChange: função para atualizar o estado
- multiple: permite seleção multipla
- label: rótulo do campo(requer inputlabel)
- displayEmpty: mostra placeholder mesmo se vazio
- rendervalue: permite customizar a exibição do valor selecionado
- menuprops: customiza o dropdow(altura,rolagem,etc)
- slotprops: customização dos slots internos(popper,paper,etc)




# Radio buttons

São botões utilizados quando o usuário precisa ver todas as opções disponíveis

o radio é um componente de botão de seleção única com aparência de bolinha (checkbox circular).

o radiogroup é um wrapper que organiza vários Radios e gera um único valor selecionado — como um Select, mas com todos os itens visíveis.


nele utilizamos esses componentes:

- formcontrol: Agrupamento semântico (acessibilidade e layout)
- formLabel: Rótulo do grupo (ex: "Gênero")
- RadioGroup: Garante que apenas um Radio esteja selecionado
- FormControlLabel: Empacota Radio com o rótulo visível
- Radio: o botão em si


props úteis do Radiogroup:

- value: valor selecionado(estado)
- Onchage: atualização do estado
- row: mostra os botões na horizontal


```tsx
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material"

const MuiRadioButton=()=>{
    return(
      <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
      <RadioGroup
       
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
      </RadioGroup>
    </FormControl>
    )
}

export default MuiRadioButton
```


# Checkbox

componente usado quando o usuário pode ativar ou desativar uma ou mais opções (diferente do Radio, que é seleção única). 


props:

- checked: valor booleano(controlado pelo estado)
- Onchange: manipula a mudança de estado
- color: cor do checkbox(primary,sucess,etc)
- indeterminate: 	Meio marcado (ex: seleção parcial em tabelas)
- size: small ou medium
- icon,checkedIcon: customiza os icones
- required: torna obrigatória a marcação
- disable: desativa o checkbox


```tsx
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material"

const MuiCheckbox=()=>{
    return(
        <Box>
       
        <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
            <FormControlLabel required control={<Checkbox />} label="Required" />
            <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
        </FormGroup>
           
        </Box>
    )
}

export default MuiCheckbox
```



# Componentes de formulário


formcontrol:É o container base para campos de formulário, como TextField, Select, RadioGroup, Checkbox, etc. Ele garante layout consistente, melhora acessibilidade (ligando rótulo, input e texto de ajuda), suporta props como: error, required, disabled, fullWidth, etc.

```tsx
<FormControl fullWidth required>
  <InputLabel>Nome</InputLabel>
  <Select>{/* opções */}</Select>
</FormControl>
```


Formgroup:Usado para agrupar múltiplos Checkbox ou Switch que pertencem ao mesmo grupo de seleção (múltipla).

ele alinha verticalmente ou horizontalmente( se row), pode ser usando com o formcontrolabel para rótulos


```tsx
<FormGroup row>
  <FormControlLabel control={<Checkbox />} label="React" />
  <FormControlLabel control={<Checkbox />} label="Angular" />
</FormGroup>
```


formcontrolLabel: Empacota um componente de entrada (como Checkbox, Radio, Switch) com um rótulo ao lado.


formLabel:Fornece um rótulo descritivo para um grupo de inputs — como RadioGroup, Checkboxes, etc.


```tsx
<FormLabel>Gênero</FormLabel>
<RadioGroup>...</RadioGroup>
```


formHelperText:Adiciona um texto auxiliar abaixo de um campo, geralmente para dar dicas ou exibir mensagens de erro.

```tsx
<FormControl error>
  <InputLabel>Email</InputLabel>
  <Input />
  <FormHelperText>Email inválido</FormHelperText>
</FormControl>
```

exemplo de formulário:

```tsx
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const MuiFormulario = () => {
  const [nome, setNome] = useState("");
  const [genero, setGenero] = useState("");
  const [cursos, setCursos] = useState<string[]>([]);
  const [erros, setErros] = useState({
    nome: false,
    genero: false,
    cursos: false,
  });

  const handleCursoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCursos((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novoErros = {
      nome: nome.trim() === "",
      genero: genero === "",
      cursos: cursos.length === 0,
    };
    setErros(novoErros);

    const valido = !Object.values(novoErros).includes(true);
    if (valido) {
      alert("Formulário enviado com sucesso!");
      console.log({ nome, genero, cursos });
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Cadastro de Curso
      </Typography>

      <form onSubmit={handleSubmit}>
    
        <FormControl fullWidth required error={erros.nome} margin="normal">
          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          {erros.nome && (
            <FormHelperText>O nome é obrigatório.</FormHelperText>
          )}
        </FormControl>

  
        <FormControl component="fieldset" required error={erros.genero} margin="normal">
          <FormLabel>Gênero</FormLabel>
          <RadioGroup
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            row
          >
            <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
            <FormControlLabel value="feminino" control={<Radio />} label="Feminino" />
            <FormControlLabel value="outro" control={<Radio />} label="Outro" />
          </RadioGroup>
          {erros.genero && (
            <FormHelperText>Por favor, selecione uma opção.</FormHelperText>
          )}
        </FormControl>

 
        <FormControl required component="fieldset" error={erros.cursos} margin="normal">
          <FormLabel>Cursos de interesse</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  value="React"
                  checked={cursos.includes("React")}
                  onChange={handleCursoChange}
                />
              }
              label="React"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="Angular"
                  checked={cursos.includes("Angular")}
                  onChange={handleCursoChange}
                />
              }
              label="Angular"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="Vue"
                  checked={cursos.includes("Vue")}
                  onChange={handleCursoChange}
                />
              }
              label="Vue"
            />
          </FormGroup>
          {erros.cursos && (
            <FormHelperText>Selecione pelo menos um curso.</FormHelperText>
          )}
        </FormControl>

      
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Enviar
        </Button>
      </form>
    </Box>
  );
};

export default MuiFormulario;


```


# Switch


é ideal para representar estados binários (ligado/desligado), parecido com um checkbox, mas com um visual mais moderno, tipo “interruptor”.


props:

- checked: estado booleano do switch
- Onchange: callback para mudar o estado
- color: cor do switch(primary,sucess,etc)
- disabled: desativa o switch
- size: small ou medium


```tsx
const [darkMode, setDarkMode] = useState(false);

<FormControlLabel
  control={
    <Switch
      checked={darkMode}
      onChange={(e) => setDarkMode(e.target.checked)}
    />
  }
  label="Modo Escuro"
/>

```



# Rating 

É um componente visual que permite o usuário selecionar um valor de 1 a 5 (ou mais), com ou sem frações, para avaliações.

Muito usado em:

Avaliações de produtos

Feedback de usuários

Classificação de conteúdo



props:

- value: valor atual(estado)
- onchange: função ao alterar valor do estado
- precision: Define fração (ex: 0.5 para meia estrela)
- max: 	Número máximo de ícones (default = 5)
- readonly:Torna o componente apenas visual
- disabled: Desativa interação
- icon/emptyicon: customiza o icone
- highlightSelectedOnly: Destaca apenas o valor selecionado, não os anteriores


```tsx
import { Favorite, FavoriteBorder } from "@mui/icons-material"
import { Rating, Stack } from "@mui/material"
import { useState, type ChangeEvent } from "react"

const MuiRating=()=>{
    const [value,setValue]=useState<number| null>(null)
    const handleChange=(event:ChangeEvent<{}>,newValue:number|null)=>{
        setValue(newValue)
    }
    console.log(value)

    return(
        <Stack spacing={2}>
            <Rating value={value} size="large" emptyIcon={<FavoriteBorder fontSize="inherit"/>} icon={<Favorite color="error" fontSize="inherit"/>} precision={0.5} onChange={handleChange}></Rating>
        </Stack>
    )
}


export default MuiRating
```



# Autocomplete

é um componente usado para buscar rapidamente enquanto digita


props:


- options: lista que será renderizada
- renderinput: Campo de entrada (usualmente um TextField)
- value: valor atual(controlado pelo estado)
- onChange: mudar o estado
- getOptionLabel: Como mostrar o label de cada item (útil para objetos)
- isOptionEqualToValue: 	Compara opção com valor (para objetos)
- freeSolo: Permite digitação livre (não precisa estar na lista)
- multiple: Permite múltiplas seleções (retorna array)
- disableClearable: Remove o botão de limpar
- loading: mostra spinner de carregamento


```tsx
import { Autocomplete, Stack, TextField } from "@mui/material"
import { useState } from "react"

type Skill={
    id:number
    label:string
}

const MuiAutoComplete=()=>{
    const [value,setValue]=useState<string | null>(null)
    const [skill,setSkill]=useState<Skill | null>(null)
    const skills:string[]=['html','css','javascript','typescript','react']


    const skillsOptions:Skill[]=skills.map((skill,index)=>({
        id:index+1,
        label:skill
    }))

    console.log({skill})

    return(
        <Stack spacing={2} width='250px'>
            <Autocomplete freeSolo options={skills} value={value} onChange={(event,newvalue:string|null)=> setValue(newvalue)}  renderInput={(params)=><TextField {...params} label="skills" />}></Autocomplete>
             <Autocomplete  options={skillsOptions} value={skill} onChange={(event,newvalue:Skill|null)=> setSkill(newvalue)}  renderInput={(params)=><TextField {...params} label="skills" />}></Autocomplete>
        </Stack>
    )
}


export default MuiAutoComplete
```



# Grid

O Grid do Material UI implementa um sistema de 12 colunas, inspirado no Flexbox Grid do Bootstrap. Ele te ajuda a alinhar, espaçar e distribuir componentes responsivamente na tela.

Você usa dois componentes principais:

Grid container → representa a linha

Grid item → representa a coluna

Eles trabalham juntos para formar o layout.

Sistema de 12 colunas:
Cada linha (container) tem 12 unidades

Você distribui essas unidades entre os itens


prop:

- xs={12}: ocupa 100% da largura em telas pequenas
- xs={6}: ocupa metade da largura
- md={4}: em telas médias, ocupa 4 colunas
- lg={3}: em telas grandes, ocupa 3 colunas