import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from "zod"



const UserSchema=z.object({
    firstname:z.string(),
    email:z.string().email(),
    profileUrl:z.string().url(),
    age:z.number().min(1),
    settings:z.object({
        isSubscribed:z.boolean()
    }),
    friends:z.array(z.string()).max(3)
})


type User= z.infer<typeof UserSchema>

const user:User={
    firstname:'ernestogo',
    email:'contact@gmail.com',
    profileUrl:'https://zod.dev/basics',
    age:23,
    settings:{isSubscribed:true},
    friends:['friend  1','friend 2','friend 3']
}




const Zod=()=>{
    
    const form=useForm<User>({
        resolver:zodResolver(UserSchema)
    })


    function handleSubmit(data:User){
        const result=UserSchema.safeParse(data)
        
        if(result.success){
            //handle
        }else{
            //handle error
        }
    }


    console.log(UserSchema.safeParse(user))
    return(
        <div>
            <p>oi</p>
        </div>
    )
}


export default Zod