type BaseAPIResponse = {
	status: number;
};

export type APIResponse<T> = BaseAPIResponse & { data: T };
