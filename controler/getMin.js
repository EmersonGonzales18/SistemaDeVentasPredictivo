const Result = require('../model/DTO/Result')
const authenticateJWT = require("../utilities/jwt")
const getMin =async (req,res)=>{
    const user = req.cookies.user;
    const role = req.cookies.role;
    const jwt = req.cookies.jwt;
    // VERIFICAR ROL VALIDO PARA LA ACCION : TODO
    let key = await authenticateJWT(user,role,jwt,role)
    if(!key){
        console.error("ERROR JWS")
        res.json(new Result(true,500,null,"ERROR"));        
        return;
    }
    res.json(new Result(false,200,process.env.MIN,"OK"));      
}
module.exports = getMin