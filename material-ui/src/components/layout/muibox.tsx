import { Box, Divider, Stack,Paper} from "@mui/material"

const Muibox=()=>{
    return(
        <Paper sx={{padding:'32px',backgroundColor:'white'}} elevation={4} >
        <Stack border='1px solid' direction='row' width={500} spacing={2} divider={<Divider orientation="vertical" flexItem />}>
             <Box p={2} sx={{'&:hover':{backgroundColor:'primary.light'}}} bgcolor='primary.main' color='white' height='100px' width='100px' >
            codeEvolution
        </Box>

        <Box display='flex' bgcolor='success.light'  height='100px' p={2} width='100px'>

        </Box>

        </Stack>
       


        </Paper>
    )
}


export default Muibox