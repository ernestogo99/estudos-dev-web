import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, FormControl, FormLabel, TextField, Typography } from "@mui/material";
import type React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {z} from "zod"
import { email } from "zod/v4-mini";



const schema=z.object({
    email:z.string().email(),
    password:z.string().min(6)
})


type newFormFields=z.infer<typeof schema>

type formFields={
    email:string,
    password:string
}


const FormZod:React.FC=()=>{
    const {register,handleSubmit,setError,formState:{errors,isSubmitting}}=useForm<newFormFields>({
        defaultValues:{
            email:"e@gmail.com", 
        },
        resolver:zodResolver(schema)
    })


    const onSubmit:SubmitHandler<newFormFields>=async (data)=>{
        try{
        await new Promise((resolve)=>setTimeout(resolve,1000))
        throw new Error
        console.log(data)
        }catch(error){
            setError("email",{
                message:"This-email was already taken"
            })
        }
       
    }

    return(
        <Box width={300}>
            <Typography>React hook form with zod</Typography>

            <Box my={2} onSubmit={handleSubmit(onSubmit)} component="form" gap={2} display='flex' flexDirection='column'>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <TextField  error={!!errors.email} helperText={errors.email?.message} {...register("email",)} label="email" ></TextField>
                </FormControl>

                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <TextField error={!!errors.password} helperText={errors.password?.message} {...register("password")} label="password" type="password"></TextField>
                </FormControl>


                <Button disabled={isSubmitting}  variant="contained" type="submit">{isSubmitting? "Loading":"Submit "}</Button>
            </Box>
        </Box>
    )
}

export default FormZod