const Auth = require("../service/auth.service");
const express = require("express");
const router = express.Router();
 



router.post("/api/register", async (req, res)=>
{
     const { name, email, password } = req.body;
     const data = { name, email, password };
   
     const register = await Auth.Register(data);

     if (register) {
            return res.status(200).json(register);
        } else {
            return res.status(500).json({ error: "Registration failed" });
         }

}
);


router.post("/api/login", async (req, res)=>
{
    try {
        console.log("taking input");
        const {email, password} = req.body;
        console.log(email, password);
        const login = await Auth.login({email, password});
        if(!login)
        {
           return res.status(404).json("user with email and password does not exist");
        }
        return res.status(200).status("Logged in");
    } catch (error) {
        return res.status(500).json("SERVER ERROR");
    }
    
})

module.exports = router;
