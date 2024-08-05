const axios = require('axios');
const Boom = require('@hapi/boom');
const ProductModel = require('../models/productModel');

const ProductService = {
  async getAllProducts(page, limit) {
    return await ProductModel.getAll(page, limit);
  },

  async getProductById(id) {
    return await ProductModel.getById(id);
  },

  async getProductBySku(sku) {
    return await ProductModel.getBySku(sku);
  },

  async createProduct(product) {
    const existingProduct = await ProductModel.findBySku(product.sku);
    if (existingProduct) {
      throw Boom.conflict('Product with this SKU already exists');
    }
    return await ProductModel.create(product);
  },

  async updateProductById(id, product) {
    return await ProductModel.updateById(id, product);
  },

  async updateProductBySku(sku, product) {
    return await ProductModel.updateBySku(sku, product);
  },

  async deleteProductById(id) {
    await ProductModel.deleteById(id);
  },

  async deleteProductBySku(sku) {
    await ProductModel.deleteBySku(sku);
  },

  async importProductsFromDummyJson() {
    const response = await axios.get('https://dummyjson.com/products');
    const products = response.data.products;

    for (const product of products) {
      const existingProduct = await ProductModel.findBySku(product.id.toString());
      if (!existingProduct) {
        await ProductModel.create({
          title: product.title,
          sku: product.id.toString(),
          image: product.thumbnail,
          price: product.price,
          description: product.description,
        });
      }
    }
  },
};

module.exports = ProductService;