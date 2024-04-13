
const jwt = require('jsonwebtoken');

const authenticateJWT = async (user,role, token,ROLE) => {
    console.log(user,role, token,ROLE)
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        resolve(false);
      } else {
        console.log(decoded)
        if (decoded.role == role && 
            decoded.role == ROLE &&
            decoded.user == user ) {
            console.log("jwt aprueba...")
          resolve(true);
        } else {
            console.log("jwt NOOOOO aprueba...")
          resolve(false);
        }
      }
    });
  });
};

module.exports = authenticateJWT;
