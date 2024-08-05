const TransactionController = require('../controllers/transactionController');
const Joi = require('@hapi/joi');

module.exports = [
  {
    method: 'GET',
    path: '/transactions',
    handler: TransactionController.getAllTransactions,
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
    path: '/transactions/{sku}',
    handler: TransactionController.getTransactionBySku,
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
    path: '/transactions',
    handler: TransactionController.createTransaction,
    options: {
      validate: {
        payload: Joi.object({
          sku: Joi.string().required(),
          qty: Joi.number().integer().required()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/transactions/{id}',
    handler: TransactionController.updateTransaction,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        }),
        payload: Joi.object({
          sku: Joi.string(),
          qty: Joi.number().integer()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/transactions/{id}',
    handler: TransactionController.deleteTransaction,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      }
    }
  }
];