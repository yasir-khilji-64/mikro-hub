import { Types } from 'mongoose';
import Products from '../products/seed';
import { type WarehouseType } from './warehouse.schema';

type WarehouseWithId = WarehouseType & { _id: Types.ObjectId };
const warehouse: WarehouseWithId[] = [
	{
		_id: new Types.ObjectId(),
		products: Products.map((product) => ({
			productId: product._id.toString(),
			quantity: 10,
		})),
	},
];

export default warehouse;
