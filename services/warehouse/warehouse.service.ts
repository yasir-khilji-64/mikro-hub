import { config } from 'dotenv';
import { type Context, Errors, type ServiceSchema } from 'moleculer';
import DbService from 'moleculer-db';
import MongooseAdapter from 'moleculer-db-adapter-mongoose';
import { z } from 'zod';
import warehouse from './seed';
import {
	getProductCountByID,
	getProductQuantities,
	updateProductQuantity,
} from './warehouse.action';
import { WarehouseModel } from './warehouse.model';
import {
	productCountProductId,
	type WarehouseSettings,
	type WarehouseThis,
} from './warehouse.schema';

const WarehouseService: ServiceSchema<WarehouseSettings, WarehouseThis> = {
	name: 'warehouse',
	settings: {
		defaultName: 'Warehouse',
	},
	adapter: new MongooseAdapter(process.env.MONGO_URI || 'mongodb://mongo:27017/products'),
	mixins: [DbService],
	model: WarehouseModel,
	actions: {
		getProductQuantities: {
			handler: getProductQuantities,
		},
		updateProductQuantity: {
			handler: updateProductQuantity,
		},
		getProductCount: {
			rest: {
				method: 'GET',
				path: '/count/:id',
			},
			params: {
				id: 'string',
			},
			hooks: {
				before(this: WarehouseThis, ctx: Context<typeof productCountProductId.context>) {
					const result = productCountProductId.validator.safeParse(ctx.params);
					if (!result.success) {
						throw new Errors.ValidationError(JSON.parse(result.error.message), 'VALIDATION_ERROR');
					}
				},
			},
			handler: getProductCountByID,
		},
	},
	methods: {
		envConfig(this: WarehouseThis) {
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
			const count = await WarehouseModel.countDocuments();
			if (count === 0) {
				await WarehouseModel.create(warehouse);
				this.logger.info('Seeding warehouse');
			}
		},
	},
	created() {
		this.envConfig();
	},
	async afterConnected(this: WarehouseThis) {
		await this.seedDb();
	},
};

export default WarehouseService;
