import { model, Schema } from 'mongoose';
import { type WarehouseType } from './warehouse.schema';

const schema = new Schema<WarehouseType>(
	{
		products: [
			{
				productId: { type: String, required: true },
				quantity: {
					type: Number,
					required: true,
					min: [0, 'Quantity must be greater than or equal to 0'],
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

// eslint-disable-next-line import/prefer-default-export, @typescript-eslint/naming-convention
export const WarehouseModel = model<WarehouseType>('Warehouse', schema);
