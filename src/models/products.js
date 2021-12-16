const Container = require('../../Container');
const { optionsMySQL } = require('./dataBasesConfig');

const productsContainer = new Container(optionsMySQL, 'products');

const getAllProducts = async () =>{
    const productList = await productsContainer.getAll();
    return productList;
}

const getProductById = async (idProduct) => {
    const listById = await productsContainer.getById(idProduct);
    return listById;
};

const saveProduct = async (product) => {
    const savedProduct = await productsContainer.save(product);
    return savedProduct;
};

const updateProduct = async (idProduct, product) => {
    const updatedList = await productsContainer.update(idProduct, product);
    return updatedList;
}

const deleteProduct = async (idProduct) => {
    const newList = await productsContainer.deleteById(idProduct);
    return newList;
};

module.exports = {
    getAllProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct
};