const ProductController = require('../controllers/productController');
const Joi = require('@hapi/joi');

module.exports = [
  {
    method: 'GET',
    path: '/products',
    handler: ProductController.getAllProducts,
    options: {
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(10)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/products/{sku}',
    handler: ProductController.getProductBySku,
    options: {
      validate: {
        params: Joi.object({
          sku: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/products',
    handler: ProductController.createProduct,
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          sku: Joi.string().required(),
          image: Joi.string().uri(),
          price: Joi.number().positive().required(),
          description: Joi.string().allow(null)
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/products/{sku}',
    handler: ProductController.updateProductBySku,
    options: {
      validate: {
        params: Joi.object({
          sku: Joi.string().required()
        }),
        payload: Joi.object({
          title: Joi.string(),
          image: Joi.string().uri(),
          price: Joi.number().positive(),
          description: Joi.string().allow(null)
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/products/{sku}',
    handler: ProductController.deleteProductBySku,
    options: {
      validate: {
        params: Joi.object({
          sku: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/products/import',
    handler: ProductController.importProducts
  }
];