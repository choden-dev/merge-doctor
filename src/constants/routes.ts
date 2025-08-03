export const VALID_ROUTES = {
	DEFAULT_ROUTE: "/",
	ADD_REPO_ROUTE: "/add-repo",
	REMOTE_REPOSITORY_ROUTE: "/remote-repo",
} as const;

export type ValidRoute = (typeof VALID_ROUTES)[keyof typeof VALID_ROUTES];

export const ROUTES_WITH_SIDEBAR: ValidRoute[] = [
	VALID_ROUTES.REMOTE_REPOSITORY_ROUTE,
] as const;
