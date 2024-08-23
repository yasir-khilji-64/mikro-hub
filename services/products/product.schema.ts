/* eslint-disable @typescript-eslint/naming-convention */
import { type Service, type ServiceSettingSchema } from 'moleculer';
import { ZodParams } from 'moleculer-zod-validator';
import { Types } from 'mongoose';
import { z } from 'zod';

export enum ProductCategories {
	ELECTRONICS = 'electronics',
	CLOTHING = 'clothing',
	HOME = 'home',
	BOOKS = 'books',
	SPORTS = 'sports',
}

interface ProductVars {
	dbUri: string;
}
interface ProductMethods {
	envConfig(): void;
	seedDb(): Promise<void>;
}
export interface ActionBuyProducts {
	id: string;
}
export interface ProductSettings extends ServiceSettingSchema {
	defaultName: string;
}
export type ProductThis = Service<ProductSettings> & ProductVars & ProductMethods;
export const buyProductValidator = new ZodParams({
	id: z
		.string()
		.refine((value) => Types.ObjectId.isValid(value), { message: 'Provide a valid MongoDB ID' }),
});

export const ProductSchema = z.object({
	name: z.string({ required_error: 'Product name is required' }).min(1),
	description: z.string().nullish(),
	price: z.number({ required_error: 'Price is required' }).positive(),
	category: z.nativeEnum(ProductCategories),
	sku: z.string().length(10, { message: 'SKU must be exactly 10 characters long' }),
});
export type ProductType = z.infer<typeof ProductSchema>;
