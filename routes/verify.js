const jwt = require("jsonwebtoken");

const Product = require("../moduels/Product");
//    verifyToken, thats mean eny user

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

// verifyTokenAndAuthorization only users,

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
      //لاتأسف عللى قدر الزمان لا طالما رقصت على جسس الاسود كلاب وطبعا يا معلم الباقي عارفو انت ههههه
    }
  });
};

//  verifyTokenAndAdmin only admins 

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not Admin to do that!");
      }
    });
  };

  const  upPrice =async (req, res,next) =>{
    try {
      const updatedProduct = await Product.update(
        req.params.id,
        {
          $set: {
            price: 6,
          },
        },
        { multi: true }
      );
      res.status(200).json(updatedProduct);
      next();
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  }
//    verifyToken, thats mean eny user
// verifyTokenAndAuthorization only users,
//  verifyTokenAndAdmin only admins

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    upPrice
  };