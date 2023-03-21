//Middleware

const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
    //Makes sure user is authenticated
    const authHeader = req.headers.authorization;
    console.log(authHeader);


    if (authHeader) {
        jwt.verify(authHeader.split(" ")[1], process.env.JWT_SEC, (err, user) => {
            if (err) {
                return res.status(403).json({ msg: "Token is not valid" });
            }

            req.user = user;
            next(); // Leaves function and continues to route!

        });
    } else {
        //res.redirect("/login");
        return res.status(401).json({ msg: "Not Authenticated" });
    }

}



module.exports = { verifyToken};
