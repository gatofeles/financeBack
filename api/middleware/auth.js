const jwt = require('jsonwebtoken');


function auth(req, resp, next){
    const token = req.header('x-auth-token');
    if(!token){
        return resp.status(401).send("User not authenticated.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = decoded;
        next();

    } catch (error) {
        resp.status(400).send("User not authenticated.");
    }
    
}

module.exports = auth;