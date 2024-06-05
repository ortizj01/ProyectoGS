import { Router } from "express";
import {getProductos, postProductos, putProductos, deleteProductos,getProducto} from '../controllers/productos.controllers.js'


const router = Router()

router.get('/productos',getProductos)

router.get('/productos/:id',getProducto)

router.post('/productos',postProductos)

router.patch('/productos/:id',putProductos)

router.delete('/productos/:id',deleteProductos)

export default router