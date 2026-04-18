const Auth = require("../auth/auth.service");


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required"
      });
    }

    
    const user = await Auth.Register({ name, email, password });

    
    if (!user) {
      return res.status(500).json({
        error: "Registration failed"
      });
    }

    
    return res.status(201).json({
      message: "User registered successfully",
      data: user
    });

  } catch (err) {
    
    console.error("REGISTER ERROR:", err);

    
    if (err.message.includes("duplicate")) {
      return res.status(409).json({
        error: "User already exists"
      });
    }
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message
    });
  }
};

exports.login = async (req, res) =>
{
    try {
        
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
}