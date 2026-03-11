import * as zod from "zod"


const Registerschema=zod.object({
    name:zod.string(),
    email:zod.string().email(),
    password:zod.string().min(6),
    
    role:zod.enum(["user","business","admin"]).default("user"),
})
export default Registerschema