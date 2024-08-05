const Boom = require('@hapi/boom');
const TransactionService = require('../services/transactionService');

const TransactionController = {
  async getAllTransactions(request, h) {
    try {
      const { page, limit } = request.query;
      const transactions = await TransactionService.getAllTransactions(page, limit);
      return h.response(transactions).code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async getTransactionById(request, h) {
    try {
      const { id } = request.params;
      const transaction = await TransactionService.getTransactionById(id);
      if (!transaction) {
        return Boom.notFound('Transaction not found');
      }
      return h.response(transaction).code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async getTransactionBySku(request, h) {
    try {
      const { sku } = request.params;
      const transaction = await TransactionService.getTransactionBySku(sku);
      if (!transaction) {
        return Boom.notFound('Transaction not found');
      }
      return h.response(transaction).code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async createTransaction(request, h) {
    try {
      const transaction = await TransactionService.createTransaction(request.payload);
      return h.response(transaction).code(201);
    } catch (error) {
      if (error.message === 'Product not found') {
        return Boom.notFound(error.message);
      }
      if (error.message === 'Insufficient stock') {
        return Boom.badRequest(error.message);
      }
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async updateTransaction(request, h) {
    try {
      const { id } = request.params;
      const transaction = await TransactionService.updateTransaction(id, request.payload);
      if (!transaction) {
        return Boom.notFound('Transaction not found');
      }
      return h.response(transaction).code(200);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },

  async deleteTransaction(request, h) {
    try {
      const { id } = request.params;
      await TransactionService.deleteTransaction(id);
      return h.response().code(204);
    } catch (error) {
      if (error.isBoom) return error;
      return Boom.boomify(error, { statusCode: 500 });
    }
  },
};

module.exports = TransactionController;