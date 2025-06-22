import { Button, ButtonGroup, Stack } from "@mui/material"

const MuiButtonGroup=()=>{
    return(
          <Stack direction='row'>
    <ButtonGroup aria-label="alignment button group" variant="outlined" orientation="vertical" size="small" color="secondary">
        <Button onClick={()=>window.alert("left click")}>Left</Button>
         <Button>Center</Button>
          <Button>Right</Button>
    </ButtonGroup>
    </Stack>
    )
  
   
}

export default MuiButtonGroup