import express from "express"
import { createProduct,getAllProducts,searchProduct,updateProduct,deleteProduct } from "../controller/product.controller.js";

const productRouter = express.Router();

productRouter.post('/',createProduct);
productRouter.get('/products',getAllProducts);
productRouter.get('/search/:id',searchProduct);
productRouter.put('/:id',updateProduct);
productRouter.delete('/:id',deleteProduct);

export default productRouter;

