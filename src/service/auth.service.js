const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
JWT_EXPIRES_IN= process.env.JWT_EXPIRES_IN;



class Auth {

    static async Register ({ name, email, password})
    {
       const SALT_ROUNDS = 10;
       const existingUser = await prisma.user.findUnique({
        where: {email}
       });

       if (existingUser) {
    throw new Error('User already exists');
     };

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

   
  const newUser = await prisma.user.create({
    data: {
        name,
      email,
      password: hashedPassword
    }
  });


  
  const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  
  const { password: _, ...userWithoutPassword } = newUser;
  return {token: token , user: userWithoutPassword};

    };



    async Login ({email, password})
    {
        const user = await prisma.user.findUnique({
            where: {email}
        });

        if(!exist)
        {
            throw new error ("user not found");
        }

        const decrypt = bcrypt.compare(password,user.password);
        if (!isMatch) throw new Error('Invalid email or password');

        
       const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
            });


  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };

    }

}



module.exports = Auth;