import { Box, Grid, Paper, styled } from "@mui/material"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));



const MuiGrid=()=>{
    return(
        <Box flexGrow={1}>
             <Grid container spacing={2}>
            <Grid size={8}>
                <Item >size=8</Item>
            </Grid>
            <Grid size={4}>
                <Item>size=4</Item>
            </Grid>
            <Grid size={4}>
                <Item>size=4</Item>
            </Grid>
            <Grid size={8}>
                <Item>size=8</Item>
            </Grid>
            </Grid>

        </Box>
           
        
    )
}

export default MuiGrid