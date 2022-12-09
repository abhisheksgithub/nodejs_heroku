import express from "express";
import { authenticateUser, authorizeUser } from "../controllers/authenticationController.js";
import {
  getProduct,
  createProduct,
  getUniqueIphone,
  getAggregateProduct,
  getProductById,
  updateProduct,
  updateProductAfterFiltering,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Get all, specific
// Update product specific
router
  .route("/")
  .get(authenticateUser, getProduct)
  .post(authenticateUser, authorizeUser('user', 'admin'), createProduct)
  .put(authenticateUser, updateProductAfterFiltering)
  .delete(authenticateUser, authorizeUser('admin'), deleteProduct);
router.route("/uniqueiphone").get(authenticateUser, getUniqueIphone);
router.route("/getAggregateProduct").get(authenticateUser, getAggregateProduct);
router
  .route("/:id")
  .get(authenticateUser, getProductById)
  .put(authenticateUser, updateProduct);

export default router;
