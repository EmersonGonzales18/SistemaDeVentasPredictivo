
let jwt = require('jsonwebtoken');
const Users = require('../model/Users');
const Result = require('../model/DTO/Result');
const path = require('path');
const fs = require('fs');
const appRoot = require('app-root-path');
const authenticateJWT = require("../utilities/jwt")

const insertUsers = async (req, res) => {
    //console.log("BODY:",req.body)
    //console.log("BODY:",req.cookies)
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
    let { name, first_name, last_name, age, gender, password, photo, address } = req.body;

    age = parseInt(age);
    if (isNaN(age) || age < 0) {
    age = 0;
    }

    gender = parseInt(gender);
    if (gender !== 0 && gender !== 1) {
    gender = 0;
    }
    
    let photoFile = req.file;
    if(photoFile==undefined){
        photoFile={
            path:path.join(appRoot.path, 'BD', 'imgs','user'),
            originalname:path.join(appRoot.path, 'BD', 'imgs','user.jpg'),
            filename:"user"
        }
    }else{
        fs.renameSync(photoFile.path, photoFile.path+ path.extname(photoFile.originalname));
    }    
        
    try {
        const users = new Users();
        result = await users.insert(name,first_name,last_name,age,gender, password, photoFile.filename + path.extname(photoFile.originalname), address, 1);

    } catch (error) {
        res.json(new Result(true,500,false,"No se pudo ingresar al usuario, revisar los datos de ingreso"));
        return;
    }       
    res.json(new Result(false,200,result,"Ok"));
};

module.exports = insertUsers;
