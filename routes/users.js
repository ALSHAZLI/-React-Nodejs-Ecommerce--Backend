
const User = require('../moduels/User');
const { verifyToken ,verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verify')
const router = require ('express').Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });


//DELET USER
router.delete("/:id", verifyTokenAndAuthorization , async(req,res,next)=>{
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("user is successfully deleted !!");
    } catch (error) {
        res.status(500).json(error);
    }
})

// GET SPASIFIC USER 
router.get("/find/:id", verifyTokenAndAdmin , async(req,res,next)=>{
    try {
        const user =  await User.findById(req.params.id);
        const { password,...others} = user._doc;
        res.status(200).json({others});

        console.log('get user success !!')
       
    } catch (error) {
        res.status(500).json(error);
    }
})
//GET ALL USERS والا ستموت في العشرين
router.get("/", verifyTokenAndAdmin , async(req,res,next)=>{
  const query = req.query.new
  try {
      const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
      
      res.status(200).json({users});

      console.log('get ALL Users success !!')
     
  } catch (error) {
      res.status(500).json(error);
  }
})

//GET USER STATS AND THE MONUTH THEY REGISTER IN IT BLAL BABABBBLBLBL

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
//for test
// router.get("/v1", (req,res)=>{
//     res.send('users request is sucsecss0!!')
// })