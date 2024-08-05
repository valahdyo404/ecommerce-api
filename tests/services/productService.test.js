const productService = require('../../src/services/productService');
const productModel = require('../../src/models/productModel');
const transactionModel = require('../../src/models/transactionModel');
const axios = require('axios');

jest.mock('../../src/models/productModel');
jest.mock('axios');

describe('Product Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return products with pagination', async () => {
      const mockProducts = [
        { title: 'Product 1', sku: 'SKU1', image: 'https://image.com', price: 10, stock: 100 },
        { title: 'Product 2', sku: 'SKU2', image: 'https://image.com', price: 20, stock: 200 },
      ];
      productModel.getAll.mockResolvedValue(mockProducts);

      const result = await productService.getAllProducts(1, 10);

      expect(result).toEqual(mockProducts);
      expect(productModel.getAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getProductBySku', () => {
    it('should return a product by sku', async () => {
      const mockProduct = { title: 'Product 1', sku: 'SKU1', price: 10, stock: 100 };
      productModel.getBySku.mockResolvedValue(mockProduct);

      const result = await productService.getProductBySku(1);

      expect(result).toEqual(mockProduct);
      expect(productModel.getBySku).toHaveBeenCalledWith(1);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const newProduct = { title: 'New Product', sku: 'NEWSKU', price: 30, description: 'Description' };
      const createdProduct = { ...newProduct };
      productModel.create.mockResolvedValue(createdProduct);

      const result = await productService.createProduct(newProduct);

      expect(result).toEqual(createdProduct);
      expect(productModel.create).toHaveBeenCalledWith(newProduct);
    });
  });

  describe('importProducts', () => {
    it('should fetch products from API and save non-duplicate products', async () => {
      const mockApiProducts = {
        products: [
          { id: 1, title: 'API Product 1', sku: 'API1', price: 40, description: 'API Description 1' },
          { id: 2, title: 'API Product 2', sku: 'API2', price: 50, description: 'API Description 2' },
        ]
      };
      axios.get.mockResolvedValue({ data: mockApiProducts });
      productModel.findBySku.mockResolvedValue(null);
      productModel.create.mockResolvedValue({});

      const result = await productService.importProductsFromDummyJson();

      expect(result).toEqual(undefined);
      expect(axios.get).toHaveBeenCalledWith('https://dummyjson.com/products');
      expect(productModel.findBySku).toHaveBeenCalledTimes(2);
      expect(productModel.create).toHaveBeenCalledTimes(2);
    });

    it('should not save duplicate products', async () => {
      const mockApiProducts = {
        products: [
          { id: 1, title: 'API Product 1', sku: 'API1', price: 40, description: 'API Description 1', image: 'https://image.com' },
        ]
      };
      axios.get.mockResolvedValue({ data: mockApiProducts });
      productModel.findBySku.mockResolvedValue({ id: 1, sku: 'API1' });

      const result = await productService.importProductsFromDummyJson();

      expect(productModel.create).not.toHaveBeenCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const productSku = 1;
      const updateData = { title: 'Updated Product', price: 15 };
      const updatedProduct = { ...updateData, stock: 100 };
      
      productModel.getBySku.mockResolvedValue({ sku: 'SKU1', stock: 100 });
      productModel.updateBySku.mockResolvedValue(updatedProduct);
  
      const result = await productService.updateProductBySku(productSku, updateData);
  
      expect(result).toEqual(updatedProduct);
      expect(productModel.updateBySku).toHaveBeenCalledWith(productSku, updateData);
    });
  });
  
  describe('deleteProduct', () => {
    it('should delete an existing product and its transactions', async () => {
      const productSku = 1;
      productModel.deleteBySku.mockResolvedValue({ rowCount: 1 });
  
      const result = await productService.deleteProductBySku(productSku);
  
      expect(result).toEqual(undefined);
      expect(productModel.deleteBySku).toHaveBeenCalledWith(productSku);
    });
  });
});