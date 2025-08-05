import { DiffView } from "@/components/presentation/diff/diff-renderer.tsx";
import { generateIdentifierForFile } from "@/components/presentation/utils.ts";
import { useDiffContext } from "@/context/diff-context.tsx";

export const RemoteRepositoryMergePreview = () => {
	const { repository, diffWithTarget, currentBranch } = useDiffContext();

	if (!repository) {
		return;
	}
	return (
		<DiffView
			diffWithTarget={diffWithTarget}
			repository={repository}
			currentBranch={currentBranch}
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
