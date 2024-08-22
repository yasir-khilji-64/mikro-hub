import type { Context, ServiceSchema } from 'moleculer';
import type { ApiSettingsSchema, GatewayResponse, IncomingRequest, Route } from 'moleculer-web';
import ApiGateway from 'moleculer-web';

interface Meta {
	userAgent?: string | null | undefined;
	user?: object | null | undefined;
}

const ApiService: ServiceSchema<ApiSettingsSchema> = {
	name: 'api',
	mixins: [ApiGateway],

	settings: {
		port: process.env.PORT != null ? Number(process.env.PORT) : 3000,
		ip: '0.0.0.0',
		use: [],
		routes: [
			{
				path: '/api',
				whitelist: ['**'],
				use: [],
				mergeParams: true,
				authentication: false,
				authorization: false,
				autoAliases: true,
				aliases: {},

				/**
				 * Before call hook. You can check the request.
				 *
				onBeforeCall(
					ctx: Context<unknown, Meta>,
					route: Route,
					req: IncomingRequest,
					res: GatewayResponse,
				): void {
					// Set request headers to context meta
					ctx.meta.userAgent = req.headers["user-agent"];
				}, */

				/**
				 * After call hook. You can modify the data.
				 *
				onAfterCall(
					ctx: Context,
					route: Route,
					req: IncomingRequest,
					res: GatewayResponse,
					data: unknown,
				): unknown {
					// Async function which return with Promise
					// return this.doSomething(ctx, res, data);
					return data;
				}, */

				callOptions: {},
				bodyParsers: {
					json: {
						strict: false,
						limit: '1MB',
					},
					urlencoded: {
						extended: true,
						limit: '1MB',
					},
				},
				mappingPolicy: 'all', // Available values: "all", "restrict"
				logging: true,
			},
		],

		log4XXResponses: false,
		logRequestParams: null,
		logResponseData: null,

		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: 'public',
			options: {},
		},
	},

	methods: {
		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 */
		authenticate(ctx: Context, route: Route, req: IncomingRequest): Record<string, unknown> | null {
			// Read the token from header
			const auth = req.headers.authorization;

			if (auth && auth.startsWith('Bearer')) {
				const token = auth.slice(7);

				// Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
				if (token === '123456') {
					// Returns the resolved user. It will be set to the `ctx.meta.user`
					return { id: 1, name: 'John Doe' };
				}
				// Invalid token
				throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_INVALID_TOKEN, null);
			} else {
				// No token. Throw an error or do nothing if anonymous access is allowed.
				// throw new E.UnAuthorizedError(E.ERR_NO_TOKEN);
				return null;
			}
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 */
		authorize(ctx: Context<null, Meta>, route: Route, req: IncomingRequest) {
			// Get the authenticated user.
			const { user } = ctx.meta;

			// It check the `auth` property in action schema.
			if (req.$action.auth === 'required' && !user) {
				throw new ApiGateway.Errors.UnAuthorizedError('NO_RIGHTS', null);
			}
		},
	},
};

export default ApiService;
