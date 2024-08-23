import { type Context } from 'moleculer';
import { HttpStatusCodes } from '../../shared/enums/http-status.enum';
import type { APIResponse } from '../../shared/types/api-response';
import { ProductModel } from './product.model';
import { type buyProductValidator, type ProductThis, type ProductType } from './product.schema';

// eslint-disable-next-line import/prefer-default-export
export async function getAvailableProducts(this: ProductThis): Promise<APIResponse<ProductType[]>> {
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

export function buyProduct(
	this: ProductThis,
	ctx: Context<typeof buyProductValidator.context>,
): APIResponse<string> {
	this.logger.info(`ID: ${ctx.params.id}`);
	return {
		status: HttpStatusCodes.OK,
		data: ctx.params.id,
	};
}
