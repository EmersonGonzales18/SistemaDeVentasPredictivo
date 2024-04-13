
let jwt = require('jsonwebtoken');
const Users = require('../model/Users');
const Result = require('../model/DTO/Result');
const authenticateJWT = require("../utilities/jwt")

const deleteUsers = async (req, res) => {
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
    let result;
    const id = req.body.id; 
    console.log(req.body)
    try {
      const users = new Users();
      result = await users.delete(id);
    } catch (error) {
      res.json(new Result(true, 500, [], "ERROR"));
      return;
    }
    res.json(new Result(false, 200, result, "OK"));
};

module.exports = deleteUsers;
