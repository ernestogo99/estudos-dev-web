import { Bookmark, BookmarkBorder } from "@mui/icons-material"
import { Box, Checkbox, FormControlLabel, FormGroup,FormControl, FormLabel } from "@mui/material"
import { useState, type ChangeEvent } from "react"

const MuiCheckbox=()=>{
    const [accept,setAccept]=useState(false)
    const [skills,setSkills]=useState<string[]>([])
    console.log(accept)
    console.log(skills)
    const handleAccept=(e:ChangeEvent<HTMLInputElement>)=>{
        setAccept(e.target.checked)
    }
   


    const handleSkillChange=(e:ChangeEvent<HTMLInputElement>)=>{
        const index=skills.indexOf(e.target.value)
        if(index===-1){
            setSkills([...skills,e.target.value])
        }else{
            setSkills(skills.filter((skill)=>skill!==e.target.value))
        }
    }

    return(
        <Box>
       
        <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
            <FormControlLabel required   control={<Checkbox checked={accept} onChange={handleAccept} />} label="Accept terms and conditions" />
           <Box>
             <Checkbox icon={<BookmarkBorder/>} checked={accept} onChange={handleAccept} checkedIcon={<Bookmark/>}></Checkbox>
           </Box>
        </FormGroup>

        <Box>
            <FormControl>
                <FormLabel>Skills</FormLabel>
                <FormGroup>
                     <FormControlLabel required   control={<Checkbox value='html' checked={skills.includes('html')} onChange={handleSkillChange} />} label="html" />
                     <FormControlLabel required   control={<Checkbox value='css' checked={skills.includes('css')} onChange={handleSkillChange} />} label="css" />
                     <FormControlLabel required   control={<Checkbox value='javascript' checked={skills.includes('javascript')} onChange={handleSkillChange} />} label="javascript" />
                </FormGroup>
            </FormControl>
        </Box>
           
        </Box>
    )
}

export default MuiCheckbox