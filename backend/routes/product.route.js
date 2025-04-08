import express from 'express';
import { 
    getProducts, 
    getProductById,
    createProduct, 
    updateProduct, 
    deleteProduct, 
    purchaseProduct 
} from '../controllers/product.controller.js';

const router = express.Router();

router.get("/", getProducts); 
router.get("/:id", getProductById); 
router.post("/", createProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);
router.put("/purchase/:id", purchaseProduct);

export default router;