
const Users = require('../model/Users');
const Result = require('../model/DTO/Result');
const fs = require('fs');
const path = require('path');
const authenticateJWT = require("../utilities/jwt")

const updateUserAdmin = async (req, res) => {
    const user = req.cookies.user;
    const role = req.cookies.role;
    const jwtToken = req.cookies.jwt;
    // VERIFICAR ROL VALIDO PARA LA ACCION : TODO
    let key = await authenticateJWT(user,role,jwtToken,2)
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

    //console.log(req.body)
    const photoFile = req.file;

    try {
        const users = new Users();
        
        if (photoFile) {
            // Cambiar el nombre del archivo para incluir la extensión original
            const newFileName = photoFile.filename + path.extname(photoFile.originalname);

            // Mover el archivo a la ubicación deseada
            const newFilePath = photoFile.path +path.extname(photoFile.originalname);

            fs.renameSync(photoFile.path, newFilePath);

            result = await users.selfUpdate(user,name,first_name, last_name, age, gender,  password, newFileName, address, 2);
        } else {
            
            result = await users.selfUpdate(user,name,first_name, last_name, age, gender,  password, null, address, 2);
        }
    } catch (error) {
        res.json(new Result(true, 500, false, "ERROR"));
        return;
    }
    
    res.json(new Result(false, 200, result, "OK"));
};

module.exports = updateUserAdmin;



