
let jwt = require('jsonwebtoken');
const Users = require('../model/Users');
const Result = require('../model/DTO/Result');
const login =async  (req,res)=>{
    const { user, pass  } = req.body;
    let query;
    try {
        const users = new Users();
        query = await users.authenticate(user,pass);
    } catch (error) {
        //console.log(error)
        res.json(new Result(true,500,false,"ERROR"))
        return;
    }
    
    //console.log(query)
    if(!query){
        res.json(new Result(false,401,false,"NO AUTENTICATE"))
        return;
    }

    const payload = {
        user:query['id'],
        role:query['role']
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY);
    
    res.cookie('user', query['id'], { httpOnly: true });
    res.cookie('role', query['role'], { httpOnly: true });
    res.cookie('jwt', token, { httpOnly: true });
    res.json(new Result(false,200,{ok:true,role:query['role']},"AUTENTICATE"));

}

module.exports = login