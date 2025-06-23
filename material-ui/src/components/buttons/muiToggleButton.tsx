import { FormatBold, FormatItalic, FormatUnderlined } from "@mui/icons-material"
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material"
import React, { useState } from "react"

const MuiToggleButton=()=>{
    const [formats,setFormats]=useState<string[]>([])
    // utilizamos quando usamos a prop exclusive const [format,setFormat]=useState<string | null>(null)
    console.log({
        formats,
    })

    const handleFormatChange=(event:React.MouseEvent<HTMLElement>,updatedFormats:string[])=>{
        setFormats(updatedFormats)
    }

    return(
        <Stack> 
            <ToggleButtonGroup size="small" color="secondary" orientation="vertical" aria-label="text-formating" value={formats} onChange={handleFormatChange}>
            <ToggleButton value='bold' aria-label="bold"><FormatBold></FormatBold> </ToggleButton>
            <ToggleButton value='italic' aria-label="italic"><FormatItalic></FormatItalic></ToggleButton>
            <ToggleButton value='underlined' aria-label="underlined"><FormatUnderlined></FormatUnderlined></ToggleButton>
        </ToggleButtonGroup></Stack>
       
    )
}


export default MuiToggleButton