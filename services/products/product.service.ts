import { config } from 'dotenv';
import { type Context, Errors, type ServiceSchema } from 'moleculer';
import DbService from 'moleculer-db';
import MongooseAdapter from 'moleculer-db-adapter-mongoose';
import { z } from 'zod';
import { buyProduct, getAvailableProducts } from './product.action';
import { ProductModel } from './product.model';
import { buyProductValidator, type ProductSettings, type ProductThis } from './product.schema';
import products from './seed';

const ProductService: ServiceSchema<ProductSettings, ProductThis> = {
	name: 'products',
	settings: {
		defaultName: 'Products',
	},
	adapter: new MongooseAdapter(process.env.MONGO_URI || 'mongodb://mongo:27017/products'),
	mixins: [DbService],
	model: ProductModel,
	actions: {
		getAvailableProducts: {
			rest: {
				method: 'GET',
				path: '/get-available-products',
			},
			handler: getAvailableProducts,
		},
		buyProduct: {
			rest: {
				method: 'PATCH',
				path: '/buy-product/:id',
			},
			params: {
				id: 'string',
			},
			hooks: {
				before(this: ProductThis, ctx: Context<typeof buyProductValidator.context>) {
					const result = buyProductValidator.validator.safeParse(ctx.params);
					if (!result.success) {
						throw new Errors.ValidationError(JSON.parse(result.error.message), 'VALIDATION_ERROR');
					}
				},
			},
			handler: buyProduct,
		},
	},
	methods: {
		envConfig(this: ProductThis) {
			config();
			const envSchema = z.object({
				MONGO_URI: z.string().url(),
			});
			const parsed = envSchema.safeParse(process.env);
			if (!parsed.success) {
				this.logger.error('Invalid environment variables: ', parsed.error.format());
				process.exit(1);
			}
			this.dbUri = parsed.data.MONGO_URI;
			this.logger.info('Env Config done');
		},
		async seedDb() {
			const count = await ProductModel.countDocuments();
			if (count === 0) {
				await ProductModel.create(products);
				this.logger.info('Seeding products');
			}
		},
	},
	created() {
		this.envConfig();
	},
	async afterConnected(this: ProductThis) {
		await this.seedDb();
	},
};
export default ProductService;
