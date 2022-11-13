const jwt = require('jsonwebtoken');
const User = require('../models/user');



const admin = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ msg: 'No auth token, access denied' });
        }
        const verified = jwt.verify(token, "passwordKey");
        if (!verified) {
            return res.status(401).json({ msg: 'Token verification faild, authorization denied' });
        }
        const user=await User.findById(verified.id);
        if(user.type=='user'||user.type=='seller'){
            return res.status(401).json({msg:'You are not an admin!'})
        }
        req.user = verified.id;
        req.token = token;

        // const file=req.file;
        // if(!file){
        //     return res.status(400).json({msg:'please upload a file'})
        // }
        // req.file=file;

        next();
    } catch (e) {
        res.status(500).json({ error: e.msg });
    }
}

module.exports=admin;