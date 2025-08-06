import { DiffView } from "@/components/presentation/diff/diff-renderer.tsx";
import { generateIdentifierForFile } from "@/components/presentation/utils.ts";
import { useDiffContext } from "@/context/diff-context.tsx";

export const RemoteRepositoryMergePreview = () => {
	const {
		repository,
		diffWithTarget,
		currentBranch,
		fetchRemoteRepositoryInformation,
	} = useDiffContext();

	if (!repository) {
		return;
	}
	return (
		<DiffView
			// TODO pass real refs in
			additionalRefs={[]}
			diffWithTarget={diffWithTarget}
			repository={repository}
			currentBranch={currentBranch}
			onRefChange={(refName) => {
				if (refName !== currentBranch) {
					fetchRemoteRepositoryInformation(repository, refName);
				}
			}}
			onClick={(file) => {
				document
					.getElementById(
						generateIdentifierForFile(file.oldRevision, file.newRevision),
					)
					?.scrollIntoView({ behavior: "smooth" });
			}}
		/>
	);
};
