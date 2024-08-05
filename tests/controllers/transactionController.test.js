const Boom = require('@hapi/boom');
const TransactionService = require('../../src/services/transactionService');
const TransactionController = require('../../src/controllers/transactionController');

jest.mock('../../src/services/transactionService');

describe('TransactionController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTransactions', () => {
    it('should return all transactions', async () => {
      const request = { query: { page: 1, limit: 10 } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      TransactionService.getAllTransactions.mockResolvedValue([{ id: 1, sku: 'sku1' }]);

      const response = await TransactionController.getAllTransactions(request, h);

      expect(TransactionService.getAllTransactions).toHaveBeenCalledWith(1, 10);
      expect(response).toEqual(h.response([{ id: 1, sku: 'sku1' }]).code(200));
    });

    it('should handle errors', async () => {
      const request = { query: { page: 1, limit: 10 } };
      const h = { response: jest.fn().mockReturnThis() };
      const error = new Error('Some error');
      TransactionService.getAllTransactions.mockRejectedValue(error);

      const response = await TransactionController.getAllTransactions(request, h);

      expect(response).toEqual(Boom.boomify(error, { statusCode: 500 }));
    });
  });

  describe('getTransactionById', () => {
    it('should return a transaction by ID', async () => {
      const request = { params: { id: 1 } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      TransactionService.getTransactionById.mockResolvedValue({ id: 1, sku: 'sku1' });

      const response = await TransactionController.getTransactionById(request, h);

      expect(TransactionService.getTransactionById).toHaveBeenCalledWith(1);
      expect(response).toEqual(h.response({ id: 1, sku: 'sku1' }).code(200));
    });

    it('should return 404 if transaction not found', async () => {
      const request = { params: { id: 1 } };
      const h = { response: jest.fn().mockReturnThis() };
      TransactionService.getTransactionById.mockResolvedValue(null);

      const response = await TransactionController.getTransactionById(request, h);

      expect(response).toEqual(Boom.notFound('Transaction not found'));
    });

    it('should handle errors', async () => {
      const request = { params: { id: 1 } };
      const h = { response: jest.fn().mockReturnThis() };
      const error = new Error('Some error');
      TransactionService.getTransactionById.mockRejectedValue(error);

      const response = await TransactionController.getTransactionById(request, h);

      expect(response).toEqual(Boom.boomify(error, { statusCode: 500 }));
    });
  });

  describe('getTransactionBySku', () => {
    it('should return a transaction by SKU', async () => {
      const request = { params: { sku: 'sku1' } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      TransactionService.getTransactionBySku.mockResolvedValue({ id: 1, sku: 'sku1' });

      const response = await TransactionController.getTransactionBySku(request, h);

      expect(TransactionService.getTransactionBySku).toHaveBeenCalledWith('sku1');
      expect(response).toEqual(h.response({ id: 1, sku: 'sku1' }).code(200));
    });

    it('should return 404 if transaction not found', async () => {
      const request = { params: { sku: 'sku1' } };
      const h = { response: jest.fn().mockReturnThis() };
      TransactionService.getTransactionBySku.mockResolvedValue(null);

      const response = await TransactionController.getTransactionBySku(request, h);

      expect(response).toEqual(Boom.notFound('Transaction not found'));
    });

    it('should handle errors', async () => {
      const request = { params: { sku: 'sku1' } };
      const h = { response: jest.fn().mockReturnThis() };
      const error = new Error('Some error');
      TransactionService.getTransactionBySku.mockRejectedValue(error);

      const response = await TransactionController.getTransactionBySku(request, h);

      expect(response).toEqual(Boom.boomify(error, { statusCode: 500 }));
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const request = { payload: { sku: 'sku1', quantity: 2 } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      TransactionService.createTransaction.mockResolvedValue({ id: 1, sku: 'sku1', quantity: 2 });

      const response = await TransactionController.createTransaction(request, h);

      expect(TransactionService.createTransaction).toHaveBeenCalledWith(request.payload);
      expect(response).toEqual(h.response({ id: 1, sku: 'sku1', quantity: 2 }).code(201));
    });

    it('should return 404 if product not found', async () => {
      const request = { payload: { sku: 'sku1', quantity: 2 } };
      const h = { response: jest.fn().mockReturnThis() };
      const error = new Error('Product not found');
      TransactionService.createTransaction.mockRejectedValue(error);

      const response = await TransactionController.createTransaction(request, h);

      expect(response).toEqual(Boom.notFound('Product not found'));
    });

    it('should return 400 if insufficient stock', async () => {
      const request = { payload: { sku: 'sku1', quantity: 2 } };
      const h = { response: jest.fn().mockReturnThis() };
      const error = new Error('Insufficient stock');
      TransactionService.createTransaction.mockRejectedValue(error);

      const response = await TransactionController.createTransaction(request, h);

      expect(response).toEqual(Boom.badRequest('Insufficient stock'));
    });

    it('should handle other errors', async () => {
      const request = { payload: { sku: 'sku1', quantity: 2 } };
      const h = { response: jest.fn().mockReturnThis() };
      const error = new Error('Some error');
      TransactionService.createTransaction.mockRejectedValue(error);

      const response = await TransactionController.createTransaction(request, h);

      expect(response).toEqual(Boom.boomify(error, { statusCode: 500 }));
    });
  });

  describe('updateTransaction', () => {
    it('should update a transaction', async () => {
      const request = { params: { id: 1 }, payload: { sku: 'sku1', quantity: 2 } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      TransactionService.updateTransaction.mockResolvedValue({ id: 1, sku: 'sku1', quantity: 2 });

      const response = await TransactionController.updateTransaction(request, h);

      expect(TransactionService.updateTransaction).toHaveBeenCalledWith(1, request.payload);
      expect(response).toEqual(h.response({ id: 1, sku: 'sku1', quantity: 2 }).code(200));
    });

    it('should return 404 if transaction not found', async () => {
      const request = { params: { id: 1 }, payload: { sku: 'sku1', quantity: 2 } };
      const h = { response: jest.fn().mockReturnThis() };
      TransactionService.updateTransaction.mockResolvedValue(null);

      const response = await TransactionController.updateTransaction(request, h);

      expect(response).toEqual(Boom.notFound('Transaction not found'));
    });

    it('should handle errors', async () => {
      const request = { params: { id: 1 }, payload: { sku: 'sku1', quantity: 2 } };
      const h = { response: jest.fn().mockReturnThis() };
      const error = new Error('Some error');
      TransactionService.updateTransaction.mockRejectedValue(error);

      const response = await TransactionController.updateTransaction(request, h);

      expect(response).toEqual(Boom.boomify(error, { statusCode: 500 }));
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a transaction', async () => {
      const request = { params: { id: 1 } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      TransactionService.deleteTransaction.mockResolvedValue();
  
      await TransactionController.deleteTransaction(request, h);
  
      expect(TransactionService.deleteTransaction).toHaveBeenCalledWith(1);
      expect(h.code).toHaveBeenCalledWith(204); 
      expect(h.response).toHaveBeenCalled();
    });
  
    it('should handle errors', async () => {
      const request = { params: { id: 1 } };
      const h = { response: jest.fn().mockReturnThis() };
      const error = new Error('Some error');
      TransactionService.deleteTransaction.mockRejectedValue(error);
  
      const response = await TransactionController.deleteTransaction(request, h);
  
      expect(response).toEqual(Boom.boomify(error, { statusCode: 500 }));
    });
  });
});