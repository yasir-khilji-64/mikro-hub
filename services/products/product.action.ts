import { type Context, Errors } from 'moleculer';
import { Types } from 'mongoose';
import { HttpStatusCodes } from '../../shared/enums/http-status.enum';
import type { APIResponse } from '../../shared/types/api-response';
import { type WarehouseType } from '../warehouse/warehouse.schema';
import { ProductModel } from './product.model';
import {
	type buyProductValidator,
	type ProductThis,
	type ProductType,
	type WithID,
} from './product.schema';

// eslint-disable-next-line import/prefer-default-export
export async function getAvailableProducts(
	this: ProductThis,
): Promise<APIResponse<WithID<ProductType & { quantity: number }>[]>> {
	const products = await ProductModel.aggregate<WithID<ProductType>>([
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
	const productQuantities = await this.broker.call<WarehouseType[]>(
		'warehouse.getProductQuantities',
	);
	const quantityMap = productQuantities.reduce((acc, item) => {
		item.products.forEach((product) => {
			acc[product.productId] = product.quantity;
		});
		return acc;
	}, {} as Record<string, number>);
	const productsWithQuantities = products
		.map((product) => {
			const quantity = quantityMap[product.id] || 0;
			return {
				...product,
				quantity,
			};
		})
		.filter((product) => product.quantity > 0);

	return {
		status: HttpStatusCodes.OK,
		data: productsWithQuantities,
	};
}

export async function buyProduct(
	this: ProductThis,
	ctx: Context<typeof buyProductValidator.context>,
): Promise<APIResponse<WithID<ProductType>>> {
	const result: APIResponse<{ productId: string; quantity: number }> = await this.broker.call(
		'warehouse.updateProductQuantity',
		{
			productId: ctx.params.id,
		},
	);
	if (result.status !== HttpStatusCodes.OK) {
		// Throw moleculer error
		throw new Errors.MoleculerError(
			`Product ${ctx.params.id} not found in warehouse`,
			HttpStatusCodes.NOT_FOUND,
			'ERR_PRODUCT_NOT_FOUND',
		);
	}
	const product = await ProductModel.aggregate<WithID<ProductType>>([
		{
			$match: {
				_id: new Types.ObjectId(ctx.params.id),
			},
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
		data: product[0],
	};
}
