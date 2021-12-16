const faker = require ('faker');

const fakerProducts = [...new Array(5)].map((_, index)=>({
    id: index,
    nombre: faker.commerce.productName(),
    precio:faker.commerce.price(),
    foto: faker.random.image()
}));

module.exports= fakerProducts;