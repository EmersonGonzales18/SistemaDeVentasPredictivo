let jwt = require('jsonwebtoken');
const Products = require('../model/Products');
const Result = require('../model/DTO/Result');
const authenticateJWT = require("../utilities/jwt")


const deleteProduct = async (req, res) => {
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


    let {id} = req.body
    let result ;
    try {
        const products = new Products()
        result = await products.delete(id)
    } catch (error) {
        res.json(new Result(true,500,null,"ERROR"));
        return;
    }
    if(result==0){
        res.json(new Result(true,400,null,"ERROR"));
        return;
    }
    res.json(new Result(false,200,result,"OK"));
};

module.exports = deleteProduct;
