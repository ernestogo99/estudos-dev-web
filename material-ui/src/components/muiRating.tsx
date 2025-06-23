import { Favorite, FavoriteBorder } from "@mui/icons-material"
import { Rating, Stack } from "@mui/material"
import { useState, type ChangeEvent } from "react"

const MuiRating=()=>{
    const [value,setValue]=useState<number| null>(null)
    const handleChange=(event:ChangeEvent<{}>,newValue:number|null)=>{
        setValue(newValue)
    }
    console.log(value)

    return(
        <Stack spacing={2}>
            <Rating value={value} size="large" emptyIcon={<FavoriteBorder fontSize="inherit"/>} icon={<Favorite color="error" fontSize="inherit"/>} precision={0.5} onChange={handleChange}></Rating>
        </Stack>
    )
}


export default MuiRating