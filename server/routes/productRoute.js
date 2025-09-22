import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';

const productRouter = express.Router();



   // You can change There image input file type and then change  file type string to array set in input to file .  In there video end is 7:30:00
// productRouter.post('/add', upload.array('images', 5), authSeller, addProduct);
 productRouter.post('/add',upload.array(["images"]), authSeller , addProduct)
productRouter.get('/list', productList)
productRouter.get('/id', productById)
productRouter.post('/stock', authSeller, changeStock)

export default productRouter;