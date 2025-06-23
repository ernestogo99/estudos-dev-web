import { Autocomplete, Stack, TextField } from "@mui/material"
import { useState } from "react"

type Skill={
    id:number
    label:string
}

const MuiAutoComplete=()=>{
    const [value,setValue]=useState<string | null>(null)
    const [skill,setSkill]=useState<Skill | null>(null)
    const skills:string[]=['html','css','javascript','typescript','react']


    const skillsOptions:Skill[]=skills.map((skill,index)=>({
        id:index+1,
        label:skill
    }))

    console.log({skill})

    return(
        <Stack spacing={2} width='250px'>
            <Autocomplete freeSolo options={skills} value={value} onChange={(event,newvalue:string|null)=> setValue(newvalue)}  renderInput={(params)=><TextField {...params} label="skills" />}></Autocomplete>
             <Autocomplete  options={skillsOptions} value={skill} onChange={(event,newvalue:Skill|null)=> setSkill(newvalue)}  renderInput={(params)=><TextField {...params} label="skills" />}></Autocomplete>
        </Stack>
    )
}


export default MuiAutoComplete