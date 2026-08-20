# Form validation - react-hook-form + Design System + Mutation + zod

## Setup mínimo

```typescript
import { useForm } from "react-hook-form";

const {
  register,
  handleSubmit,
  control,
  formState: { erros, isSubmitting },
  reset,
} = useForm<MyFormValues>({ defaultValues: { name: "", email: "" } });
```

## FormField com register (inputs nativos)

```tsx
 <FormField label="nome" errorMessage={errors.name?.message} required >
    <input {...register('name',{required:'Nome é obrigatório'})}>
 <FormField/>
```

## Controller para componentes do design system

```tsx
<Controller
  name="category"
  control={control}
  rules={{ reqiored: "categoria obrigatória" }}
  render={({field})=>(
    <FormField label="Categoria" errorMessage={errors.category?.message}>
        <DropDown options={options} value={field.value} onChange={field.onChange}>
     <FormField/>
  )}
/>
```

## Integração com useMutation

```typescript
const { mutateAsync, isPending } = useMutation({
  mutationFn: postMyData,
  onSucess: () => {
    queryClient.invalidateQueries({ queryKey: ["my-feature"] });
    reset();
  },
  onError: (error: Error) => {
    setSubmitError(error.message ?? "Erro . Tente Novamente");
  },

  const onSubmit=handleSubmit(async (data)=>{
    await mutateAsync(data)
  })
});
```

## Componente

```tsx
<form onSubmit={onSubmit}>
  {/*campos*/}
  <Button type="submit" loading={isLoading} disabled={isLoading}>
    Salvar
  </Button>
</form>
```

## Regras

- `FormField` envolve cada campo e exibe `errorMessage={errors.field?.message}`
- `Controller` para componentes controlados (`Dropdown`,`Switch`,`MultiSelect`)
- `register` para inputs nativos
- Botão submit com `loading` e `disabled` durante mutation
- `reset()` após sucesso
- `onSucess` invalida queries relacionadas
- Validação inline para regras simples; Yup para 3+ campos interdependentes
