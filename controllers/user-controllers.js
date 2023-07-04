const bcrypt = require('bcryptjs');
const compareSync = bcrypt.compareSync;
const hashSync = bcrypt.hashSync;

const Users = require('../models/User');


const getAllUsers = async (req,res) => {
    try {
        const userDoc = await Users.find();
        return res.status(200).json({ userDoc });
    } catch (err) {
        console.log(err);
        return res.status(406).json({message:"Some error occured"});
    };
}

const getUserById=async (req,res)=>{
    try{
        const userId=req.params.id;
        const user=await Users.findById(userId).populate("posts");
        if(!user){
            return res.status(404).json({user});
        }
        return res.status(200).json({user});
    }catch(err){
        console.log(err);
        return res.status(406).json({message:"Some error occured"});
    }
}

const signup = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || name.trim().length === 0 || !email || email.trim().length === 0 || !password || password.length<6) {
            return res.status(422).json({ message: "Invalid Data" });
        }
        let hashedPassword = hashSync(password);
        let userDoc =await new Users({ name, email, password:hashedPassword });
        await userDoc.save();
        return res.status(201).json({ userDoc });
    } catch (err) {
        console.log(err.message);
        return res.status(406).json({message:err.message});
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password || email.trim().length === 0 || password.length < 6) {
            return res.status(422).json({ message: "Invalid Data" });
        }
        let existingUser = await Users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        let isCorrectPassword = compareSync(password, existingUser.password);
        if (!isCorrectPassword) {
            return res.status(400).json({ message: "Incorrect password" })
        }
        return res.status(200).json({ _id: existingUser.id, message: "Login succesful" });
    } catch (err) {
        console.log(err);
        return res.status(406).json({message:"Some error occured"});
    }
}

const deleteUser = async(req,res)=>{
    try{
        await Users.findByIdAndRemove(req.params.id);
        return res.status(200).json({message:"deleted successfully"});
    }catch(err){
        return console.log(err);
    }
}


module.exports = { getAllUsers, signup, login,deleteUser, getUserById};