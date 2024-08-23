/* eslint-disable @typescript-eslint/naming-convention */
import { type Service, type ServiceSettingSchema } from 'moleculer';
import { ZodParams } from 'moleculer-zod-validator';
import { Types } from 'mongoose';
import { z } from 'zod';

interface WarehouseVars {
	dbUri: string;
}
interface WarehouseMethods {
	envConfig(): void;
	seedDb(): Promise<void>;
}
export interface ActionUpdateWarehouseProductQuantity {
	productId: string;
}
export interface WarehouseSettings extends ServiceSettingSchema {
	defaultName: string;
}
export type WarehouseThis = Service<WarehouseSettings> & WarehouseVars & WarehouseMethods;
export const updateWarehouseProductValidator = new ZodParams({
	productId: z
		.string()
		.refine((value) => Types.ObjectId.isValid(value), { message: 'Provide a valid MongoDB ID' }),
});
export const productCountProductId = new ZodParams({
	id: z
		.string()
		.refine((value) => Types.ObjectId.isValid(value), { message: 'Provide a valid MongoDB ID' }),
});

export const WarehouseSchema = z.object({
	products: z.array(
		z.object({
			productId: z
				.string()
				.refine((value) => Types.ObjectId.isValid(value), { message: 'Invalid product ID' }),
			quantity: z.number().nonnegative(),
		}),
	),
});
export type WarehouseType = z.infer<typeof WarehouseSchema>;
