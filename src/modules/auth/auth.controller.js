const Auth = require("../auth/auth.service");


exports.register = async (req, res) => {
  try {
    console.log("running");

    const { name, email, password } = req.body;

    const data = { name, email, password };

    const result = await Auth.Register(data);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Register error:", error.message);

    if (error.message === "User already exists") {
      return res.status(409).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};



exports.login = async (req, res) => {
  try {
    console.log("taking input");

    const { email, password } = req.body;
    console.log(email, password);

    const result = await Auth.Login({ email, password });

    return res.status(200).json({
      message: "Logged in successfully",
      ...result,
    });
  } catch (error) {
    console.error("Login error:", error.message);

    if (error.message === "User not found") {
      return res.status(404).json({
        error: error.message,
      });
    }

    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};