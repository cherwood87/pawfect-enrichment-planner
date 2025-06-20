import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: (failureCount, error: any) => {
					if (error?.message?.includes("auth") || error?.status === 401) {
						return false;
					}
					return failureCount < 3;
				},
				staleTime: 5 * 60 * 1000,
				gcTime: 10 * 60 * 1000,
			},
			mutations: {
				retry: (failureCount, error: any) => {
					if (error?.status >= 400 && error?.status < 500) {
						return false;
					}
					return failureCount < 2;
				},
			},
		},
	});
};
