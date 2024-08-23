import { config } from 'dotenv';
import { type ServiceSchema } from 'moleculer';
import DbService from 'moleculer-db';
import MongooseAdapter from 'moleculer-db-adapter-mongoose';
import { z } from 'zod';
import { listProducts } from './product.action';
import { ProductModel } from './product.model';
import type { ProductSettings, ProductThis } from './product.schema';
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
		list: {
			rest: {
				method: 'GET',
				path: '/list',
			},
			handler: listProducts,
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
			}
		},
	},
	created() {
		this.envConfig();
	},
	async afterConnected(this: ProductThis) {
		await this.seedDb();
		this.logger.info('Seeding products');
	},
};
export default ProductService;
