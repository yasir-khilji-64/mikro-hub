import { Types } from 'mongoose';
import { ProductCategories, type ProductType } from './product.schema';

type ProductWithId = ProductType & { _id: Types.ObjectId };
const products: ProductWithId[] = [
	{
		_id: new Types.ObjectId('66c7cdb628a51fe906a1a29e'),
		name: 'Laptop',
		description: 'High performance laptop with 16GB RAM and 512GB SSD',
		price: 999.99,
		category: ProductCategories.ELECTRONICS,
		sku: 'ABCDEFGHIJ',
	},
	{
		_id: new Types.ObjectId('66c7cdb628a51fe906a1a29f'),
		name: 'Smartphone',
		description: 'Latest model with 128GB storage and a 6.1 inch display',
		price: 799.99,
		category: ProductCategories.ELECTRONICS,
		sku: 'KLMNOPQRST',
	},
	{
		_id: new Types.ObjectId('66c7cdb628a51fe906a1a300'),
		name: 'Coffee Table Book',
		description: 'Beautifully illustrated coffee table book on modern art',
		price: 29.99,
		category: ProductCategories.BOOKS,
		sku: 'UVWXYZ1234',
	},
	{
		_id: new Types.ObjectId('66c7cdb628a51fe906a1a301'),
		name: 'Running Shoes',
		description: 'Lightweight running shoes with excellent cushioning',
		price: 59.99,
		category: ProductCategories.CLOTHING,
		sku: 'ABCDEF1234',
	},
	{
		_id: new Types.ObjectId('66c7cdb628a51fe906a1a302'),
		name: 'Desk Lamp',
		description: 'Adjustable desk lamp with soft white LED light',
		price: 24.99,
		category: ProductCategories.HOME,
		sku: 'UVWXYZ5678',
	},
	{
		_id: new Types.ObjectId('66c7cdb628a51fe906a1a303'),
		name: 'Smartwatch',
		description: 'Water-resistant smartwatch with heart rate monitor',
		price: 149.99,
		category: ProductCategories.ELECTRONICS,
		sku: 'KLMNOP5678',
	},
	{
		_id: new Types.ObjectId('66c7cdb628a51fe906a1a304'),
		name: 'Cookbook',
		description: 'Collection of gourmet recipes from renowned chefs',
		price: 39.99,
		category: ProductCategories.BOOKS,
		sku: 'UVWXYZ9012',
	},
];

export default products;
