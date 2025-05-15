import express from 'express';
import { 
    getProducts, 
    getProductById,
    createProduct, 
    updateProduct, 
    deleteProduct, 
    purchaseProduct 
} from '../controllers/product.controller.js';
import { checkAuth, checkRole } from '../middleware/auth.js';
import upload from '../middleware/uploadMiddleware.js'; 


const router = express.Router();



router.get("/", getProducts); 
router.get("/:id", getProductById); 
router.post("/",checkAuth,checkRole(['admin']),upload.single('Image'), createProduct);
router.delete("/:id",checkAuth,checkRole(['admin']), deleteProduct);

router.put("/:id", checkAuth, checkRole(['admin']), upload.single('Image'), updateProduct);

router.post('/purchase/:id', purchaseProduct);



export default router;