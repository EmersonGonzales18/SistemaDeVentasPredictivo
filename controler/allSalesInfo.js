const Result = require("../model/DTO/Result");
const Sales = require("../model/Sales");
const authenticateJWT = require("../utilities/jwt")
const allSalesInfo = async (req, res)=>{
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
    //console.log("allSalesInfo")
    let result ;
    try {
        const sales = new Sales()
        result = await sales.allInfo()
        //console.log("allInfo:",result)
    } catch (error) {    
        res.json(new Result(true,500,null,"ERROR"));
        return;
    }
    
    res.json(new Result(false,200,result,"OK"));
}

module.exports =allSalesInfo