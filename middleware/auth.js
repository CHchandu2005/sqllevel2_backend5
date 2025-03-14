const jwt=require('jsonwebtoken')
function authenticateAdmin(req, res, next) {
    // const token = req.headers.authorization;
    console.log("In middleware function");
    const token = req.headers['authorization']?.split(' ')[1]; // This gets the token part after 'Bearer'
    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" });
    }
    console.log(token);
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.adminID = decoded;
        console.log(req.adminID)
        console.log("Last of the function");
        next();
    });
}
module.exports=authenticateAdmin