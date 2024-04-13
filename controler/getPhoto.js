const path = require('path');
const fs = require('fs');
const Users = require('../model/Users');
const appRoot = require('app-root-path');
const authenticateJWT = require("../utilities/jwt")

const getPhoto = async (req, res) => {
  try {
    //console.log("photoName")
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
    const users =new Users()
    const photoName = await users.getPhoto(user);
    
    
    const photoPath = path.join(appRoot.toString(),"BD","imgs", photoName);
    ////console.log(photoPath)
    if (fs.existsSync(photoPath)) {
      // Enviar el archivo al cliente
      res.sendFile(photoPath);
    } else {
      // Si el archivo no existe, enviar una respuesta de error
      res.status(404).json({ error: 'Foto no encontrada' });
    }
  } catch (error) {
    // Manejar cualquier error ocurrido durante la obtención de la foto
    res.status(500).json({ error: 'Error al obtener la foto' });
  }
};

module.exports = getPhoto;
