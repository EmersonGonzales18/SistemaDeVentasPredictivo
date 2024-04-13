const Alert = require("../model/Alerts");
const Result = require("../model/DTO/Result");
const authenticateJWT = require("../utilities/jwt")

const chackAlert = async (req, res)=>{
    const user = req.cookies.user;
    const role = req.cookies.role;
    const jwt = req.cookies.jwt;
    // VERIFICAR ROL VALIDO PARA LA ACCION : TODO
    let key = await authenticateJWT(user,role,jwt,2)
    if(!key){
        console.error("ERROR JWS")
        res.json(new Result(true,500,null,"ERROR"));        
        return;
    }
    let id = req.params.id
    console.log("CHECK:",id)
    let result ;
    try {
        const alerts = new Alert()
        
        result = await alerts.check(user,id) 
        
        console.log(result)
    } catch (error) {    
        res.json(new Result(true,500,null,"ERROR"));
        return;
    }
    
    res.json(new Result(false,200,result,"OK"));
}

module.exports =chackAlert