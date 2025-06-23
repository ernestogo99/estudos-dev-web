import { Facebook, X } from "@mui/icons-material"
import { Stack, Button,IconButton, Icon } from "@mui/material"

const MuiButton=()=>{
    return(
        <Stack spacing={4}>
            <Stack spacing={2} direction='row'>
             <Button variant="text" href="google.com">MuiButton</Button>
             <Button variant="contained">Contained</Button>
            <Button variant="outlined">OutLined</Button>
            
            </Stack>

            <Stack spacing={2} direction='row'>
                    <Button variant="contained" color="primary">primary</Button>
                     <Button variant="outlined" color="secondary">secondary</Button>
                      <Button variant="contained" color="error">error</Button>
                       <Button variant="contained" color="info">info</Button>
                        <Button variant="contained" color="warning">warning</Button>
                         <Button variant="contained" color="inherit">inherit</Button>
                          <Button variant="contained" color="success">sucess</Button>
            </Stack>

            <Stack display='block' spacing={2} direction='row'>
                 <Button variant="contained" size="small" color="primary">small</Button>
                  <Button variant="contained" size="medium" color="primary">medium</Button>
                   <Button variant="contained" size="large" color="primary">large</Button>
            </Stack>

            <Stack spacing={2} direction='row'>
                <Button variant="contained" startIcon={<Facebook/>} disableRipple color="primary">large</Button>
                  <Button variant="contained" size="large" onClick={()=>window.alert("oi")} disableElevation endIcon={<X/>} color="primary">large</Button>
                  <IconButton aria-label="facebook"><Facebook/></IconButton>
            </Stack>


            
            

            

            </Stack>
            
           
        
    )
}


export default MuiButton