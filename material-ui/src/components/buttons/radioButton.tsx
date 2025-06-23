import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup,FormHelperText } from "@mui/material"
import { useState, type ChangeEvent } from "react"

const MuiRadioButton=()=>{
    const [value,setValue]=useState('female')
    console.log(value)

    const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{
        setValue(e.target.value)
    }

    return(
      <FormControl error>
      <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
      <RadioGroup
      row
        value={value}
        onChange={handleChange}
        aria-labelledby="demo-radio-buttons-group-label"
    
         name="radio-buttons-group"
      >
        <FormControlLabel value="female" control={<Radio size="small" color="secondary" />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
      </RadioGroup>
      <FormHelperText>Invalid selection</FormHelperText>
    </FormControl>
    )
}

export default MuiRadioButton