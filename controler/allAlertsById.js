const Alert = require("../model/Alerts");
const Result = require("../model/DTO/Result");
const authenticateJWT = require("../utilities/jwt")

const allAlertsById = async (req, res)=>{
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
    let mode  = req.params.mode
    console.log("MODE:",mode)
    let result ;
    try {
        const alerts = new Alert()
        if(mode == 1){
            result = await alerts.getAllNew(user)
        }else{
            result = await alerts.getAll(user)
        }
        
        console.log(result)
    } catch (error) {    
        res.json(new Result(true,500,null,"ERROR"));
        return;
    }
    
    res.json(new Result(false,200,result,"OK"));
}

module.exports =allAlertsById