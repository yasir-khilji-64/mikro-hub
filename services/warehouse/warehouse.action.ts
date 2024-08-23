import { type Context, Errors } from 'moleculer';
import { HttpStatusCodes } from '../../shared/enums/http-status.enum';
import { type APIResponse } from '../../shared/types/api-response';
import { WarehouseModel } from './warehouse.model';
import {
	type productCountProductId,
	type updateWarehouseProductValidator,
	type WarehouseThis,
	type WarehouseType,
} from './warehouse.schema';

// eslint-disable-next-line import/prefer-default-export, @typescript-eslint/explicit-module-boundary-types
export async function getProductQuantities(this: WarehouseThis): Promise<WarehouseType[]> {
	const result = await WarehouseModel.aggregate<WarehouseType>([
		{
			$match: {},
		},
		{
			$project: {
				_id: 0,
				id: '$_id',
				products: '$products',
			},
		},
	]);
	return result;
}

export async function getProductCountByID(
	this: WarehouseThis,
	ctx: Context<typeof productCountProductId.context>,
): Promise<APIResponse<{ productId: string; quantity: number }>> {
	const warehouseProduct = await WarehouseModel.findOne({
		'products.productId': ctx.params.id,
	});
	if (!warehouseProduct) {
		throw new Errors.MoleculerError(
			`Product ${ctx.params.id} not found in warehouse`,
			HttpStatusCodes.NOT_FOUND,
			'ERR_PRODUCT_NOT_FOUND',
		);
	}
	const product = warehouseProduct.products.find((p) => p.productId === ctx.params.id);
	if (!product) {
		throw new Errors.MoleculerError(
			`Product ${ctx.params.id} not found in warehouse`,
			HttpStatusCodes.NOT_FOUND,
			'ERR_PRODUCT_NOT_FOUND',
		);
	}
	return {
		status: HttpStatusCodes.OK,
		data: product,
	};
}

export async function updateProductQuantity(
	this: WarehouseThis,
	ctx: Context<typeof updateWarehouseProductValidator.context>,
): Promise<APIResponse<{ productId: string; quantity: number }>> {
	const warehouseProduct = await WarehouseModel.findOne({
		'products.productId': ctx.params.productId,
	});
	if (!warehouseProduct) {
		throw new Errors.MoleculerError(
			`Product ${ctx.params.productId} not found in warehouse`,
			HttpStatusCodes.NOT_FOUND,
			'ERR_PRODUCT_NOT_FOUND',
		);
	}
	const product = warehouseProduct.products.find((p) => p.productId === ctx.params.productId);
	if (!product) {
		throw new Errors.MoleculerError(
			`Product ${ctx.params.productId} not found in warehouse`,
			HttpStatusCodes.NOT_FOUND,
			'ERR_PRODUCT_NOT_FOUND',
		);
	}
	if (product.quantity <= 0) {
		throw new Errors.MoleculerError(
			'Product is out of stock',
			HttpStatusCodes.NOT_FOUND,
			'ERR_PRODUCT_OUT_OF_STOCK',
		);
	}
	const result = await WarehouseModel.updateOne(
		{
			'products.productId': ctx.params.productId,
			'products.quantity': { $gt: 0 },
		},
		{
			$inc: { 'products.$.quantity': -1 },
		},
	);
	if (result.modifiedCount === 0) {
		throw new Errors.MoleculerError(
			`Product ${ctx.params.productId} not found in warehouse`,
			HttpStatusCodes.NOT_FOUND,
			'ERR_PRODUCT_NOT_FOUND',
		);
	}
	return {
		status: HttpStatusCodes.OK,
		data: product,
	};
}
