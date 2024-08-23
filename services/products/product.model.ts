import { model, Schema } from 'mongoose';
import { ProductCategories, type ProductType } from './product.schema';

const schema = new Schema<ProductType>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: false,
			default: null,
		},
		price: {
			type: Number,
			required: true,
			min: [0, 'Price must be greater than or equal to 0'],
		},
		category: {
			type: String,
			enum: ProductCategories,
			required: true,
		},
		sku: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// eslint-disable-next-line @typescript-eslint/naming-convention, import/prefer-default-export
export const ProductModel = model<ProductType>('Product', schema);
