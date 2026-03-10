import * as zod from "zod"

const Loginschema=zod.object({
    email:zod.string().email(),
    password:zod.string().min(6),
})
export default Loginschema