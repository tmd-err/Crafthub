const userCollection = require("../Models/Schemas/User");
const bcrypt = require("bcryptjs") ;
const jwt = require("jsonwebtoken") ;

const createUserController = async (req,res)=>{

  //getting user data from the form
  let userData = {
    username : req.body.username  ,
    email : req.body.email ,
    password : req.body.password ,
    phone: req.body.phone,
    passwordConfirmation : req.body.passwordConfirmation ,
    role : req.body.role ,
    profilePicture : req.file ? req.file.filename : '' ,
  };
  //checking if user already exists in db
  const findByEmail = await userCollection.findOne({email:userData.email}) ;
  const findByUsername = await userCollection.findOne({username:userData.username}) ;
  const findByPhone = await userCollection.findOne({ phone: userData.phone });
  if (findByEmail || findByUsername || findByPhone) {
    if (findByEmail) {
      res.status(404).send("User with this email already exists");
    } else if (findByUsername) {
      res.status(404).send("User with this username already exists");
    } else if(findByPhone) {
      res.status(404).send("User with this phone number already exists");
    }
  }else{
    //function for hashing password 
    async function hashPassword(pswd){
      const salt = 3 ;
      try{
        const hashedPassword = await bcrypt.hash(pswd , salt) ;
        return hashedPassword ; 
      }catch(err){
        console.log(err) ;
      }
    } ;
    //hashing password before inserting in db
    userData.password= await hashPassword(userData.password) ; 
    //inserting in db
    const dbData = await userCollection.insertOne(userData) ;
    res.json(dbData) ;
  }
} ;

const loginUserController = async(req,res)=>{
  //function for comparing hashed password to a non-one
  async function comparePasswords(plainPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
        
    } catch (error) {
        console.error("Error comparing passwords:", error);
    }
  }
  //get user data from the form
  const userData = {
    email : req.body.email , 
    password : req.body.pswd ,
    stayConnected : req.body.stayConnected || false
  } ;
  //finding if the user exists
  const find = await userCollection.findOne({email:userData.email}) ;
  try{
    if(find){ 
      //JWT creation
      const token = jwt.sign({ userId: find._id, username: find.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
      //cookie creation
      res.cookie("Authorization", token, { maxAge: 60000 * 60, httpOnly: true, secure: true, sameSite: "Strict" });
      //verifyin passwords
      const checkPassword = await comparePasswords(userData.password , find.password) ;
      if(checkPassword){
        return res.status(200).send({find,token}) ;
      }else{
        res.status(400).send("Invalid credentials ! ");
      }
    }else{
      res.status(400).send("Invalid credentials ! ") ;
    };  
  }catch(err){
    res.status(404).send("Error occured while logining !") ;
  }
  


};

const logoutUserController = async(req,res)=>{
  res.clearCookie('User',{signed:true}) ;
  res.clearCookie('Authorization',{signed:true}) ;
  res.clearCookie('token',{signed:true}) ;
  res.status(200).send("cookie has been cleared !") ;
}

const findUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find user by ID
    const user = await userCollection.findById(userId);
    
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    // Return user data without sensitive information
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
      createdAt: user.createdAt
    };
    
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).send("Error occurred while retrieving user data");
  }
};
const updatePasswordController = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).send("Current password and new password are required");
    }
    
    // Find user by ID
    const user = await userCollection.findById(userId);
    
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).send("Current password is incorrect");
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the password
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).send("Password updated successfully");
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send("Error occurred while updating password");
  }
};

module.exports = {
    createUserController,
    loginUserController ,
    logoutUserController ,
    findUserController ,
    updatePasswordController
} ; 