const Boom = require('@hapi/boom');
const TransactionModel = require('../models/transactionModel');
const ProductModel = require('../models/productModel');

const TransactionService = {
  async getAllTransactions(page, limit) {
    return await TransactionModel.getAll(page, limit);
  },

  async getTransactionById(id) {
    return await TransactionModel.getById(id);
  },

  async getTransactionBySku(sku) {
    return await TransactionModel.getBySku(sku);
  },

  async createTransaction(transaction) {
    const product = await ProductModel.findBySku(transaction.sku);
    if (!product) {
      throw Boom.notFound('Product not found');
    }

    const currentStock = await TransactionModel.getStockBySku(transaction.sku);
    if (Number(currentStock) + transaction.qty < 0) {
      throw Boom.badRequest('Insufficient stock');
    }

    return await TransactionModel.create(transaction);
  },

  async updateTransaction(id, transaction) {
    const existingTransaction = await TransactionModel.getById(id);
    if (!existingTransaction) {
      throw Boom.notFound('Transaction not found');
    }

    const product = await ProductModel.findBySku(transaction.sku);
    if (!product) {
      throw Boom.notFound('Product not found');
    }

    const currentStock = await TransactionModel.getStockBySku(transaction.sku);
    if (Number(currentStock) + transaction.qty < 0) {
      throw Boom.badRequest('Insufficient stock');
    }

    return await TransactionModel.update(id, transaction);
  },

  async deleteTransaction(id) {
    const existingTransaction = await TransactionModel.getById(id);
    if (!existingTransaction) {
      throw Boom.notFound('Transaction not found');
    }

    const currentStock = await TransactionModel.getStockBySku(existingTransaction.sku);
    if (Number(currentStock) - existingTransaction.qty < 0) {
      throw Boom.badRequest('Insufficient stock');
    }
    await TransactionModel.delete(id);
  },
};

module.exports = TransactionService;