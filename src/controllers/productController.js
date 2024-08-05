const Boom = require('@hapi/boom');
const ProductService = require('../services/productService');

const ProductController = {
  async getAllProducts(request, h) {
    try {
      const { page, limit } = request.query;
      const products = await ProductService.getAllProducts(page, limit);
      return h.response(products).code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async getProductById(request, h) {
    try {
      const { id } = request.params;
      const product = await ProductService.getProductById(id);
      if (!product) {
        return Boom.notFound('Product not found');
      }
      return h.response(product).code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async getProductBySku(request, h) {
    try {
      const { sku } = request.params;
      const product = await ProductService.getProductBySku(sku);
      if (!product) {
        return Boom.notFound('Product not found');
      }
      return h.response(product).code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async createProduct(request, h) {
    try {
      const product = await ProductService.createProduct(request.payload);
      return h.response(product).code(201);
    } catch (error) {
      if (error.message === 'Product with this SKU already exists') {
        return Boom.conflict(error.message);
      }
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async updateProductById(request, h) {
    try {
      const { id } = request.params;
      const product = await ProductService.updateProductById(id, request.payload);
      if (!product) {
        return Boom.notFound('Product not found');
      }
      return h.response(product).code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async updateProductBySku(request, h) {
    try {
      const { sku } = request.params;
      const product = await ProductService.updateProductBySku(sku, request.payload);
      if (!product) {
        return Boom.notFound('Product not found');
      }
      return h.response(product).code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async deleteProductById(request, h) {
    try {
      const { id } = request.params;
      await ProductService.deleteProductById(id);
      return h.response().code(204);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async deleteProductBySku(request, h) {
    try {
      const { sku } = request.params;
      await ProductService.deleteProductBySku(sku);
      return h.response().code(204);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async importProducts(request, h) {
    try {
      await ProductService.importProductsFromDummyJson();
      return h.response({ message: 'Products imported successfully' }).code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },
};

module.exports = ProductController;