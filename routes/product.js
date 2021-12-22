 
const Product = require('../moduels/Product');
const { verifyToken ,verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verify')
const router = require ('express').Router();


//ADD Product
router.post("/", verifyTokenAndAdmin,async(req,res)=>{
    const newProduct  = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error)
    }
})

//UPDATE Product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  });


//DELET Product
router.delete("/:id", verifyTokenAndAdmin , async(req,res,next)=>{
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product is successfully deleted !!");
    } catch (error) {
        res.status(500).json(error);
    }
})

// GET SPASIFIC Product 
router.get("/find/:id" , async(req,res,next)=>{
    try {
        const product =  await Product.findById(req.params.id);
        
        res.status(200).json(product);

        console.log('get Product success !!')
       
    } catch (error) {
        res.status(500).json(error);
    }
})


//GET ALL products والا ستموت في العشرين
router.get("/" , async(req,res,next)=>{
  const qNew = req.query.new
  const qCategory = req.query.category
  try {
      let products;

      if(qNew){
          products = await  Product.find().sort({ createdAt : -1 }).limit(5);
      }else if(qCategory){
          products = await Product.find({
              //$in  هو امر خاص بالمنقو ومن اسمو ظاهر 
            categories: {
                $in: [qCategory]
            }
          })
      }else{
          products = await Product.find();
      }
      
      res.status(200).json(products);

      console.log('get ALL product success !!')
     
  } catch (error) {
      res.status(500).json(error);
  }
})



module.exports = router;
