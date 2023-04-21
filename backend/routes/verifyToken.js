//Middleware

const jwt = require("jsonwebtoken");
const User = require("../models/User");


const verifyToken = async (req, res, next) => {
    

        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({ error: "Authorization Token Required" });
    }

    console.log(authorization);

    const token = authorization.split(' ')[1];
    console.log(token);

    try {

        //get user id from token
        const { id } = jwt.verify(token, 'secret123');
        req.user = await User.findOne({ _id:id }).select('_id');

        console.log(req.user);
        next();

    } catch (err) {
        console.log(err);
        res.status(401).json({ error: "Request is not Authorized" });
    }

}


module.exports = { verifyToken};
