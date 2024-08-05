const ProductService = require('../../src/services/productService');
const ProductController = require('../../src/controllers/productController');

jest.mock('../../src/services/productService');

describe('ProductController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products successfully', async () => {
      const request = { query: { page: 1, limit: 10 } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      ProductService.getAllProducts.mockResolvedValue([{ id: 1, name: 'Product 1' }]);

      const response = await ProductController.getAllProducts(request, h);
      expect(response.code).toHaveBeenCalledWith(200);
      expect(response.response).toHaveBeenCalledWith([{ id: 1, name: 'Product 1' }]);
    });

    it('should handle errors and return 500', async () => {
      const request = { query: {} };
      const h = { response: jest.fn().mockReturnThis() };
      ProductService.getAllProducts.mockRejectedValue(new Error('Database error'));

      const response = await ProductController.getAllProducts(request, h);
      expect(response.isBoom).toBe(true);
      expect(response.output.statusCode).toBe(500);
    });
  });

  describe('getProductById', () => {
    it('should return product by ID successfully', async () => {
      const request = { params: { id: 1 } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      ProductService.getProductById.mockResolvedValue({ id: 1, name: 'Product 1' });

      const response = await ProductController.getProductById(request, h);
      expect(response.code).toHaveBeenCalledWith(200);
      expect(response.response).toHaveBeenCalledWith({ id: 1, name: 'Product 1' });
    });

    it('should return 404 if product not found', async () => {
      const request = { params: { id: 999 } };
      const h = { response: jest.fn().mockReturnThis() };
      ProductService.getProductById.mockResolvedValue(null);

      const response = await ProductController.getProductById(request, h);
      expect(response.isBoom).toBe(true);
      expect(response.output.statusCode).toBe(404);
    });
  });

  describe('getProductBySku', () => {
    it('should return product by SKU successfully', async () => {
      const request = { params: { sku: 'SKU123' } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      ProductService.getProductBySku.mockResolvedValue({ sku: 'SKU123', name: 'Product 1' });

      const response = await ProductController.getProductBySku(request, h);
      expect(response.code).toHaveBeenCalledWith(200);
      expect(response.response).toHaveBeenCalledWith({ sku: 'SKU123', name: 'Product 1' });
    });

    it('should return 404 if product not found by SKU', async () => {
      const request = { params: { sku: 'SKU999' } };
      const h = { response: jest.fn().mockReturnThis() };
      ProductService.getProductBySku.mockResolvedValue(null);

      const response = await ProductController.getProductBySku(request, h);
      expect(response.isBoom).toBe(true);
      expect(response.output.statusCode).toBe(404);
    });
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const request = { payload: { sku: 'SKU123', name: 'Product 1' } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      ProductService.createProduct.mockResolvedValue({ id: 1, sku: 'SKU123', name: 'Product 1' });

      const response = await ProductController.createProduct(request, h);
      expect(response.code).toHaveBeenCalledWith(201);
      expect(response.response).toHaveBeenCalledWith({ id: 1, sku: 'SKU123', name: 'Product 1' });
    });

    it('should return 409 if SKU already exists', async () => {
      const request = { payload: { sku: 'SKU123' } };
      const h = { response: jest.fn().mockReturnThis() };
      ProductService.createProduct.mockRejectedValue(new Error('Product with this SKU already exists'));

      const response = await ProductController.createProduct(request, h);
      expect(response.isBoom).toBe(true);
      expect(response.output.statusCode).toBe(409);
    });
  });

  describe('updateProductById', () => {
    it('should update a product successfully', async () => {
      const request = { params: { id: 1 }, payload: { name: 'Updated Product' } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      ProductService.updateProductById.mockResolvedValue({ id: 1, name: 'Updated Product' });

      const response = await ProductController.updateProductById(request, h);
      expect(response.code).toHaveBeenCalledWith(200);
      expect(response.response).toHaveBeenCalledWith({ id: 1, name: 'Updated Product' });
    });

    it('should return 404 if product not found for update', async () => {
      const request = { params: { id: 999 }, payload: {} };
      const h = { response: jest.fn().mockReturnThis() };
      ProductService.updateProductById.mockResolvedValue(null);

      const response = await ProductController.updateProductById(request, h);
      expect(response.isBoom).toBe(true);
      expect(response.output.statusCode).toBe(404);
    });
  });

  describe('updateProductBySku', () => {
    it('should update a product by SKU successfully', async () => {
      const request = { params: { sku: 'SKU123' }, payload: { name: 'Updated Product' } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      ProductService.updateProductBySku.mockResolvedValue({ sku: 'SKU123', name: 'Updated Product' });

      const response = await ProductController.updateProductBySku(request, h);
      expect(response.code).toHaveBeenCalledWith(200);
      expect(response.response).toHaveBeenCalledWith({ sku: 'SKU123', name: 'Updated Product' });
    });

    it('should return 404 if product not found for update by SKU', async () => {
      const request = { params: { sku: 'SKU999' }, payload: {} };
      const h = { response: jest.fn().mockReturnThis() };
      ProductService.updateProductBySku.mockResolvedValue(null);

      const response = await ProductController.updateProductBySku(request, h);
      expect(response.isBoom).toBe(true);
      expect(response.output.statusCode).toBe(404);
    });
  });

  describe('deleteProductById', () => {
    it('should delete a product successfully', async () => {
      const request = { params: { id: 1 } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      ProductService.deleteProductById.mockResolvedValue();
  
      const response = await ProductController.deleteProductById(request, h);
      expect(h.code).toHaveBeenCalledWith(204);
      expect(h.response).toHaveBeenCalled();
    });
  
    it('should handle errors and return 500', async () => {
      const request = { params: { id: 999 } };
      const h = { response: jest.fn().mockReturnThis() };
      ProductService.deleteProductById.mockRejectedValue(new Error('Delete error'));
  
      const response = await ProductController.deleteProductById(request, h);
      expect(response.isBoom).toBe(true);
      expect(response.output.statusCode).toBe(500);
    });
  });
  
  describe('deleteProductBySku', () => {
    it('should delete a product by SKU successfully', async () => {
      const request = { params: { sku: 'SKU123' } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      ProductService.deleteProductBySku.mockResolvedValue();
  
      const response = await ProductController.deleteProductBySku(request, h);
      expect(h.code).toHaveBeenCalledWith(204);
      expect(h.response).toHaveBeenCalled();
    });
  
    it('should handle errors and return 500', async () => {
      const request = { params: { sku: 'SKU999' } };
      const h = { response: jest.fn().mockReturnThis() };
      ProductService.deleteProductBySku.mockRejectedValue(new Error('Delete error'));
  
      const response = await ProductController.deleteProductBySku(request, h);
      expect(response.isBoom).toBe(true);
      expect(response.output.statusCode).toBe(500);
    });
  });

  describe('importProducts', () => {
    it('should import products successfully', async () => {
      const request = {};
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
      ProductService.importProductsFromDummyJson.mockResolvedValue();

      const response = await ProductController.importProducts(request, h);
      expect(response.code).toHaveBeenCalledWith(200);
      expect(response.response).toHaveBeenCalledWith({ message: 'Products imported successfully' });
    });

    it('should handle errors and return 500', async () => {
      const request = {};
      const h = { response: jest.fn().mockReturnThis() };
      ProductService.importProductsFromDummyJson.mockRejectedValue(new Error('Import error'));

      const response = await ProductController.importProducts(request, h);
      expect(response.isBoom).toBe(true);
      expect(response.output.statusCode).toBe(500);
    });
  });
});