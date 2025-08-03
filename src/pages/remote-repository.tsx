import { useEffect, useMemo, useRef } from "react";
import { Navigate, Outlet, useParams } from "react-router";
import { SectionLayout } from "@/components/layout/section-layout.tsx";
import { Skeleton } from "@/components/shadcn/skeleton.tsx";
import { VALID_ROUTES } from "@/constants/routes.ts";
import { useDiffContext } from "@/context/diff-context.tsx";
import { useRemoteRepositories } from "@/controllers/remote-repository.ts";
import { RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button.tsx";
export const RemoteRepositoryPage = () => {
	const params = useParams();
	const [remoteRepositories] = useRemoteRepositories();
	const { fetchRemoteRepositoryInformation, isLoading } = useDiffContext();

	const repo = useMemo(
		() => remoteRepositories.find((repo) => repo.id === params.id),
		[params.id, remoteRepositories],
	);
	const prevId = useRef<string | null>(null);

	useEffect(() => {
		if (params.id !== prevId.current) {
			prevId.current = params.id ?? null;
			fetchRemoteRepositoryInformation(repo);
		}
	}, [params.id, repo, fetchRemoteRepositoryInformation]);

	if (!repo) {
		return <Navigate to={VALID_ROUTES.ADD_REPO_ROUTE} />;
	}

	return (
		<>
			<Button
				variant="outline"
				disabled={isLoading}
				className="w-fit mb-2"
				onClick={() => {
					fetchRemoteRepositoryInformation(repo);
				}}
			>
				<RefreshCcwIcon />
			</Button>
			<SectionLayout title={`(remote) ${repo.host}`}>
				{isLoading ? <Skeleton className="h-10 w-[250px]" /> : <Outlet />}
			</SectionLayout>
		</>
	);
};
