import { useNavigate } from "react-router";
import { SectionLayout } from "@/components/layout/section-layout.tsx";
import { RepositoryHomepageCard } from "@/components/presentation/repository-homepage-card.tsx";
import { VALID_ROUTES } from "@/constants/routes.ts";
import { useRemoteRepositories } from "@/controllers/remote-repository.ts";

export const LandingPage = () => {
	const [repositories, setRepositories] = useRemoteRepositories();

	const navigate = useNavigate();
	return (
		<SectionLayout title="Welcome">
			<h3>Your Repositories</h3>
			<div className="flex-col flex gap-2">
				{repositories.map((repo) => (
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
				))}
			</div>
		</SectionLayout>
	);
};
