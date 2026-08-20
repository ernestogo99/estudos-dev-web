# Form Validation — React Hook Form + Material UI + Zod + Mutation

## Setup mínimo

```typescript
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  category: z.string().min(1, "Categoria é obrigatória"),
});

type MyFormValues = z.infer<typeof schema>;

const {
  register,
  handleSubmit,
  control,
  reset,
  formState: { errors, isSubmitting },
} = useForm<MyFormValues>({
  resolver: zodResolver(schema),
  defaultValues: {
    name: "",
    email: "",
    category: "",
  },
});
```

## TextField com register

```tsx
<TextField
  label="Nome"
  {...register("name")}
  error={!!errors.name}
  helperText={errors.name?.message}
  required
  fullWidth
/>
```

## Controller para componentes controlados

```tsx
<Controller
  name="category"
  control={control}
  render={({ field }) => (
    <FormControl fullWidth error={!!errors.category}>
      <InputLabel>Categoria</InputLabel>

      <Select {...field} label="Categoria">
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <FormHelperText>{errors.category?.message}</FormHelperText>
    </FormControl>
  )}
/>
```

## Validação com zod

As regras de validação devem ficar no schema, evitando regras duplicadas no componente.

```tsx
const schema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve possuir pelo menos 3 caracteres"),

  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),

  category: z.string().min(1, "Categoria é obrigatória"),
});
```

Para validações entre campos:

```ts
const schema = z
  .object({
    password: z.string().min(8, "Senha deve possuir pelo menos 8 caracteres"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
```

Tipando o schema zod

```tsx
export type schemaData = z.infer<typeof schema>;
```

## Integração com useMutation

```ts
const { mutateAsync, isPending } = useMutation({
  mutationFn: postMyData,

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["my-feature"],
    });

    reset();
  },

  onError: (error: Error) => {
    setSubmitError(error.message ?? "Erro ao salvar. Tente novamente.");
  },
});

const onSubmit = handleSubmit(async (data) => {
  await mutateAsync(data);
});
```

## Componente

```tsx
<form onSubmit={onSubmit}>
  <TextField
    label="Nome"
    {...register("name")}
    error={!!errors.name}
    helperText={errors.name?.message}
    required
    fullWidth
  />

  {/* campos */}

  <Button
    type="submit"
    variant="contained"
    loading={isPending}
    disabled={isPending}
  >
    Salvar
  </Button>
</form>
```

## Regras

- register para inputs simples (TextField, input, textarea).
- Controller para componentes controlados (Select, Autocomplete, Switch, Checkbox, DatePicker).
- Zod como fonte principal das regras de validação.
- zodResolver para integrar Zod ao React Hook Form.
- z.infer<typeof schema> para gerar os tipos do formulário.
- error + helperText para exibir erros nos TextField.
- FormHelperText para erros em componentes com FormControl.
- useMutation para operações de criação, atualização e exclusão.
- Botão submit com loading e disabled durante a mutation.
- reset() após sucesso quando o formulário precisar ser limpo.
- onSuccess deve invalidar queries relacionadas quando necessário.
- Erros da API devem ser tratados separadamente dos erros de validação.
- Evitar regras de validação duplicadas no componente e no schema.
