import { Box, Button, FormControl, FormHelperText, FormLabel, Stack, TextField, Typography } from "@mui/material"
import React, { useState } from "react"

const SimpleForm=()=>{
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [errors,setErrors]=useState<{email:string; password:string}>({
        email:'',
        password:''
    })

   const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();

  const newErrors = { email: "", password: "" };

  if (!email.includes("@")) {
    newErrors.email = "Email must include @";
  }

  if (password.trim() === "") {
    newErrors.password = "Password cannot be null";
  }

  setErrors(newErrors);


  if (!newErrors.email && !newErrors.password) {
    console.log("form submitted");
  }

 
};


 const handleEmailChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
     setEmail(event.target.value)
     if(email.includes("@")){
        setErrors({...errors,email:""})
     }
  }


 const handlePasswordChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
    setPassword(event.target.value)
    if(password.trim()!==""){
        setErrors({...errors,password:""})
    }
 } 


    return(
        <Box  width={300}>
            <Typography>Formulário simples</Typography>

            <form onSubmit={handleSubmit}>

            <Box my={2} display='flex'  flexDirection='column'>
                  <FormControl>
                <FormLabel>Email</FormLabel>
                <TextField label='email'error={!!errors.email} helperText={errors.email} value={email} onChange={handleEmailChange} >
                </TextField>
               
            </FormControl>

            <FormControl>
                <FormLabel>Password</FormLabel>
                <TextField label="password" error={!!errors.password} value={password} onChange={handlePasswordChange}   helperText={errors.password} type="password"></TextField>
            </FormControl>
            
            <Stack my={2} direction='column'>
                <Button  variant="contained" type="submit">Enviar</Button>
                <button>oi</button>
            </Stack>
            </Box>
          
            
            </form>
           
        </Box>
    )
}
export default SimpleForm