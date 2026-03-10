 const Validate=(Schema)=>{
     return (req,res,next)=>{
        if (!req.body|| Object.keys(req.body).length=== 0) {
            return res.status(400).json({
                success:false,
                message:"Request body is required"
            })

         
        }


         const result = Schema.safeParse(req.body);
         if (result.success) {
               req.body= result.data
               return next()
         }
         let error={}
        result.error.issues.forEach((issue)=>{
            error[issue.path[0]]=issue.message;
        })
        return res.status(400).json({
            success:false,
             message: "Validation failed",error 
        })


     }
 }


 export default Validate
