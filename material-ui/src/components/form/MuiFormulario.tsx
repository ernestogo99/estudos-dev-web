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
