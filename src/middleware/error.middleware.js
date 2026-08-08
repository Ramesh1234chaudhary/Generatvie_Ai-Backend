const ApiResponse=require("../utils/ApiResponse");

const errorMiddleware=(err,req,res,next)=>{

const status=err.statusCode||500;

return res.status(status).json(

new ApiResponse(

status,

false,

err.message||

"Internal Server Error"

)

);

};

module.exports=errorMiddleware;