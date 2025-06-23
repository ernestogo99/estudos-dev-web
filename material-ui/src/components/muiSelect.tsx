import { Box,Select,MenuItem, FormControl, InputLabel, type SelectChangeEvent } from "@mui/material"
import { useState } from "react"

const MuiSelect=()=>{
    const[age,setAge]=useState('')

    const handleChange=(e:SelectChangeEvent)=>{
        setAge(e.target.value)
    }  
    
    console.log(age)

    return(
        <Box minWidth={120}>
            <FormControl fullWidth>
             
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
            </FormControl>
           
        </Box>
    )
}

export default MuiSelect