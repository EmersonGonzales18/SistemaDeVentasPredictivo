const Products = require("../model/Products");
const Result = require('../model/DTO/Result')
const authenticateJWT = require("../utilities/jwt")

const getMessage = async (req, res)=>{
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
    let minimum = process.env.MIN;
    let result = [];
    try {
        let products = new Products();
        let data  = await products.getAll();
        for (let i = 0; i < data.length; i++) {
            if(data[i].stock<minimum){
               result[result.length]=data[i]
            }   
       }
    } catch (error) {
        res.json(new Result(true,500,[],"ERROR"));
        return;
    }   
    res.json(new Result(false,200,result,"OK"));
}
module.exports =getMessage;