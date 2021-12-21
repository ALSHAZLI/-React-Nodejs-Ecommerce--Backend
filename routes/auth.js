
const router = require ('express').Router();
const User = require('../moduels/User')
const CryptoJs = require('crypto-js')
const jwt = require("jsonwebtoken")


//Register
router.post("/register",async(req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password:  CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    try {
        const seavdUser = await newUser.save();
        console.log('Register is Success !!');
        res.status(201).json(seavdUser);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.post("/login", async(req,res)=>{
    try {
        const user = await User.findOne({username: req.body.username});
        !user && res.status(401).json("worng cradentials");

        const hashedPass = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);
        const OriginalPassword = hashedPass.toString(CryptoJs.enc.Utf8);

        OriginalPassword !== req.body.password && res.status(401).json("worng cradentials");
        
        // using jwt bllallabalblbalal

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SEC,{expiresIn:"3d"}
        );

        //  ازا كلو في السليم نرجع معلومات اليوزر  كلها م عدا الباسورد لاغراض امنية هههه
        // get all informeation from mongodb exept Password
        
        const { password,...others} = user._doc;
        res.status(200).json({...others, accessToken});

        console.log('Login success !!')

    } catch (error) {
        res.status(5000).json(error);
    }
});

module.exports = router;