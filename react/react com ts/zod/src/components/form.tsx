import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";


const UserSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("Email inválido"),
  age: z
    .number({ invalid_type_error: "A idade deve ser um número" })
    .min(1, "Idade mínima é 1"),
  subscribed: z.boolean(),
});

console.log(UserSchema)


type UserFormData = z.infer<typeof UserSchema>;

const UserForm = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
   
  });


  const onSubmit = (data: UserFormData) => {
    console.log("Dados enviados:", data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 400, mx: "auto", mt: 5, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5">Formulário de Usuário</Typography>

      <TextField
        label="Nome"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
      />

      <TextField
        label="Email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
      />

      <TextField
        label="Idade"
        type="number"
        {...register("age", { valueAsNumber: true })}
        error={!!errors.age}
        helperText={errors.age?.message}
        fullWidth
      />

      <FormControlLabel
        control={<Checkbox {...register("subscribed")} />}
        label="Inscrito na newsletter"
      />

      <Button variant="contained" type="submit" color="primary">
        Enviar
      </Button>
    </Box>
  );
};

export default UserForm;
