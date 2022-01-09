const router = require("express").Router();

const Stripe = require("stripe");
const stripe = Stripe('sk_test_51JFehsKxWhFCDm8bsw3DC7reAcNYYJKpBtKPbH68qqTqZzAdKmkfEuTV2ABoqA4jIRyta9cAPJ6SPyg0tyqqSija00XbvGqyxw');


router.post("/payment",(req,res)=>{
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd"
    },(stripeErr,striprRes)=>{
        if(stripeErr){
            res.status(404).json(stripeErr);
            console.log(striprRes);
        }else{
            res.status(200).json(striprRes);
            
        }
    }
    
    )
})

module.exports = router;