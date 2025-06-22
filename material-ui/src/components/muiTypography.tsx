import { Box, Typography } from "@mui/material"

const MuiTypography=()=>{
    return(
        <Box>
            <Typography variant="h2">h2 header</Typography>
             <Typography variant="h3">h3 header</Typography>
            <Typography variant="h4">h4 header</Typography>
               <Typography variant="h5">h5 header</Typography>
                <Typography variant="h6" component='h1'>h6 header</Typography>
                 <Typography variant="h1">h1 header</Typography>
                  <Typography variant="subtitle1">subtitle 1</Typography>
                   <Typography variant="body1"> body1</Typography>
                    <Typography variant="body2">body2</Typography>
        </Box>
    )
}


export default MuiTypography