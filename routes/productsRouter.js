const express = require("express");
const router = express.Router();
const ProductsController = require("../controllers/ProductsController");
const upload = require("../middleware/uplord");

router.post("/register",upload , ProductsController.createProduct);
router.get("/", ProductsController.getProducts);
router.get("/:id", ProductsController.getProductById);
router.delete("/:id", ProductsController.deleteProduct);
router.put("/:id", ProductsController.updateProduct);

module.exports = router;