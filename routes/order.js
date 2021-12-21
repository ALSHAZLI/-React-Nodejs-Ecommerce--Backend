
const Order = require('../moduels/Order');
const { verifyToken ,verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verify')
const router = require ('express').Router();

//ADD Order
router.post("/", verifyToken,async(req,res)=>{
    const newOrder  = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error)
    }
})

//UPDATE Order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  });


// //DELET Order
router.delete("/:id", verifyTokenAndAdmin , async(req,res,next)=>{
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order is successfully deleted !!");
    } catch (error) {
        res.status(500).json(error);
    }
})

// GET SPASIFIC order 
router.get("/find/:userid" , verifyTokenAndAuthorization, async(req,res,next)=>{
    try {
        //users can have more than one oreder so we use finde 
        const orders =  await Order.find({userid: req.params.userid});
        
        res.status(200).json(orders);

        console.log('get Product success !!')
       
    } catch (error) {
        res.status(500).json(error);
    }
})


//GET ALL orders
router.get("/", verifyTokenAndAdmin, async(req,res)=>{
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err)
    }
})

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router;
