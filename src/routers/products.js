const express = require('express');
const { isAdmin } = require('../middlewares/admin');
const { getAllProducts, getProductById, saveProduct, deleteProduct, updateProduct } = require('../models/products');

const productsRouter = express.Router();

productsRouter.get('/', async (req, res)=>{
    const productList = await getAllProducts();
    res.send({ data: productList});
});

productsRouter.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const productById = await getProductById(id);
    res.send({ data: productById });
});

productsRouter.post('/', isAdmin, async (req, res) => {
    const newProduct = req.body;
    const newList = await saveProduct(newProduct);
    res.send({ data: newList });
});

productsRouter.put('/:id', isAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const newProduct = req.body;
    const updatedProduct = await updateProduct(id, newProduct);
    res.send({ data: updatedProduct });
});

productsRouter.delete('/:id', isAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const newList = await deleteProduct(id);
    res.send({ data: newList });
});


module.exports = productsRouter;