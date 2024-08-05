const Boom = require('@hapi/boom');
const TransactionModel = require('../../src/models/transactionModel');
const ProductModel = require('../../src/models/productModel');
const TransactionService = require('../../src/services/transactionService');

jest.mock('../../src/models/transactionModel');
jest.mock('../../src/models/productModel');

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTransactions', () => {
    it('should return all transactions', async () => {
      const mockTransactions = [{ id: 1, sku: 'product1', qty: 2 }];
      TransactionModel.getAll.mockResolvedValue(mockTransactions);
      const result = await TransactionService.getAllTransactions(1, 10);
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('getTransactionById', () => {
    it('should return a transaction by id', async () => {
      const mockTransaction = { id: 1, sku: 'product1', qty: 2 };
      TransactionModel.getById.mockResolvedValue(mockTransaction);
      const result = await TransactionService.getTransactionById(1);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('getTransactionBySku', () => {
    it('should return a transaction by sku', async () => {
      const mockTransaction = { id: 1, sku: 'product1', qty: 2 };
      TransactionModel.getBySku.mockResolvedValue(mockTransaction);
      const result = await TransactionService.getTransactionBySku('product1');
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction if product exists and stock is sufficient', async () => {
      const transaction = { sku: 'product1', qty: 2 };
      const mockProduct = { sku: 'product1', stock: 10 };
      ProductModel.findBySku.mockResolvedValue(mockProduct);
      TransactionModel.getStockBySku.mockResolvedValue(10);
      TransactionModel.create.mockResolvedValue(transaction);

      const result = await TransactionService.createTransaction(transaction);
      expect(result).toEqual(transaction);
    });

    it('should throw not found error if product does not exist', async () => {
      const transaction = { sku: 'product1', qty: 2 };
      ProductModel.findBySku.mockResolvedValue(null);
      await expect(TransactionService.createTransaction(transaction)).rejects.toThrow(Boom.notFound('Product not found'));
    });

    it('should throw bad request error if stock is insufficient', async () => {
      const transaction = { sku: 'product1', qty: -15 };
      const mockProduct = { sku: 'product1', stock: 10 };
      ProductModel.findBySku.mockResolvedValue(mockProduct);
      TransactionModel.getStockBySku.mockResolvedValue(0);
      await expect(TransactionService.createTransaction(transaction)).rejects.toThrow(Boom.badRequest('Insufficient stock'));
    });
  });

  describe('updateTransaction', () => {
    it('should update a transaction if it exists and stock is sufficient', async () => {
      const id = 1;
      const transaction = { sku: 'product1', qty: 5 };
      const existingTransaction = { id, sku: 'product1', qty: 2 };
      const mockProduct = { sku: 'product1', stock: 10 };
      TransactionModel.getById.mockResolvedValue(existingTransaction);
      ProductModel.findBySku.mockResolvedValue(mockProduct);
      TransactionModel.getStockBySku.mockResolvedValue(10);
      TransactionModel.update.mockResolvedValue(transaction);

      const result = await TransactionService.updateTransaction(id, transaction);
      expect(result).toEqual(transaction);
    });

    it('should throw not found error if transaction does not exist', async () => {
      TransactionModel.getById.mockResolvedValue(null);
      await expect(TransactionService.updateTransaction(999, {})).rejects.toThrow(Boom.notFound('Transaction not found'));
    });

    it('should throw not found error if product does not exist', async () => {
      const id = 1;
      const transaction = { sku: 'product1', qty: 5 };
      const existingTransaction = { id, sku: 'product1', qty: 2 };
      TransactionModel.getById.mockResolvedValue(existingTransaction);
      ProductModel.findBySku.mockResolvedValue(null);
      await expect(TransactionService.updateTransaction(id, transaction)).rejects.toThrow(Boom.notFound('Product not found'));
    });

    it('should throw bad request error if stock is insufficient', async () => {
      const id = 1;
      const transaction = { sku: 'product1', qty: -15 };
      const existingTransaction = { id, sku: 'product1', qty: 2 };
      const mockProduct = { sku: 'product1', stock: 10 };
      TransactionModel.getById.mockResolvedValue(existingTransaction);
      ProductModel.findBySku.mockResolvedValue(mockProduct);
      TransactionModel.getStockBySku.mockResolvedValue(10);
      await expect(TransactionService.updateTransaction(id, transaction)).rejects.toThrow(Boom.badRequest('Insufficient stock'));
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a transaction if it exists and stock is sufficient', async () => {
      const id = 1;
      const existingTransaction = { id, sku: 'product1', qty: 2 };
      TransactionModel.getById.mockResolvedValue(existingTransaction);
      TransactionModel.getStockBySku.mockResolvedValue(10);
      TransactionModel.delete.mockResolvedValue();

      await TransactionService.deleteTransaction(id);
      expect(TransactionModel.delete).toHaveBeenCalledWith(id);
    });

    it('should throw not found error if transaction does not exist', async () => {
      TransactionModel.getById.mockResolvedValue(null);
      await expect(TransactionService.deleteTransaction(999)).rejects.toThrow(Boom.notFound('Transaction not found'));
    });

    it('should throw bad request error if stock is insufficient', async () => {
      const id = 1;
      const existingTransaction = { id, sku: 'product1', qty: 100 };
      TransactionModel.getById.mockResolvedValue(existingTransaction);
      TransactionModel.getStockBySku.mockResolvedValue(10);
      await expect(TransactionService.deleteTransaction(id)).rejects.toThrow(Boom.badRequest('Insufficient stock'));
    });
  });
});