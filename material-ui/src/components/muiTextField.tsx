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
