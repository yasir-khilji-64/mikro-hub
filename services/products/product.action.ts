import { HttpStatusCodes } from '../../shared/enums/http-status.enum';
import type { APIResponse } from '../../shared/types/api-response';
import { ProductModel } from './product.model';
import { type ProductThis, type ProductType } from './product.schema';

// eslint-disable-next-line import/prefer-default-export
export async function listProducts(this: ProductThis): Promise<APIResponse<ProductType[]>> {
	const products = await ProductModel.aggregate<ProductType>([
		{
			$match: {},
		},
		{
			$project: {
				_id: 0,
				id: '$_id',
				name: '$name',
				description: '$description',
				price: '$price',
				category: '$category',
				sku: '$sku',
			},
		},
	]);
	return {
		status: HttpStatusCodes.OK,
		data: products,
	};
}
