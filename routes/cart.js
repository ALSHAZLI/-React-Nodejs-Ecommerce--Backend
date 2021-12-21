
const Cart = require('../moduels/Cart');
const { verifyToken ,verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verify')
const router = require ('express').Router();

//ADD Cart
router.post("/", verifyToken,async(req,res)=>{
    const newCart  = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error)
    }
})

//UPDATE Product
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  });


// //DELET Cart
router.delete("/:id", verifyTokenAndAuthorization , async(req,res,next)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Product is successfully deleted !!");
    } catch (error) {
        res.status(500).json(error);
    }
})

// // GET SPASIFIC Cart 
router.get("/find/:userid" , async(req,res,next)=>{
    try {
        const cart =  await Cart.findOne({userid: req.params.userid});
        
        res.status(200).json(cart);

        console.log('get Product success !!')
       
    } catch (error) {
        res.status(500).json(error);
    }
})


//GET ALL Cart والا ستموت في العشرين
router.get("/", verifyTokenAndAdmin, async(req,res)=>{
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router;
