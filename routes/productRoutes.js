const express = require("express");
const productController = require("../controllers/productController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const rateLimiter = require("../middlewares/rateLimiter");

const router = express.Router();
// must be authenticated and admin

router.get("/shop/products", rateLimiter, productController.getShopProducts);

router
  .route("/products")
  .get(productController.getAllProducts)
  .post([auth, authAdmin], productController.createProduct);

router
  .route("/products/:id")
  .get(rateLimiter, productController.getByIdProduct)
  .delete([auth, authAdmin], productController.deleteProducts)
  .put([auth, authAdmin], productController.updateProducts);

router.put("/review", auth, productController.createProductReview);

module.exports = router;
