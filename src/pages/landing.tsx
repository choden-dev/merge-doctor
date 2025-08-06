import { Link, useNavigate } from "react-router";
import { SectionLayout } from "@/components/layout/section-layout.tsx";
import { RepositoryHomepageCard } from "@/components/presentation/repository-homepage-card.tsx";
import { Button } from "@/components/shadcn/button.tsx";
import { Separator } from "@/components/shadcn/separator.tsx";
import { VALID_ROUTES } from "@/constants/routes.ts";
import { useRemoteRepositories } from "@/controllers/remote-repository.ts";

export const LandingPage = () => {
	const [repositories, setRepositories] = useRemoteRepositories();

	const navigate = useNavigate();
	return (
		<SectionLayout title="Welcome">
			<h3 className="pb-2">Your Repositories</h3>
			<Separator />
			<div className="flex-col flex gap-2">
				{repositories.length ? (
					repositories.map((repo) => (
						<RepositoryHomepageCard
							key={repo.workingDirectory}
							name={repo.host}
							caption={repo.fullPathOnRemote}
							handleSelect={() =>
								navigate(`${VALID_ROUTES.REMOTE_REPOSITORY_ROUTE}/${repo.id}`)
							}
							handleDelete={() => {
								setRepositories(
									repositories.filter(
										(existingRepo) => existingRepo.id !== repo.id,
									),
								);
							}}
						/>
					))
				) : (
					<div className="my-auto flex flex-col justify-center w-fit mt-2">
						<Button>
							<Link to={VALID_ROUTES.ADD_REPO_ROUTE}>Add Repository</Link>
						</Button>
					</div>
				)}
			</div>
		</SectionLayout>
	);
};
