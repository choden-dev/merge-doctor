import { Diff, type FileData, Hunk } from "react-diff-view";
import {
	FileList,
	type FileListProps,
} from "@/components/presentation/diff/diff-file-list.tsx";
import { tokenise } from "@/components/presentation/diff/tokenise.ts";
import { generateIdentifierForFile } from "@/components/presentation/utils.ts";
import { Separator } from "@/components/shadcn/separator.tsx";
import type { DiffInformation } from "@/context/diff-context.tsx";

export const FileDiff = ({
	oldRevision,
	newRevision,
	type,
	hunks,
	isBinary,
	newPath,
	oldPath,
}: FileData) => {
	if (isBinary) {
		// TODO: we can definitely handle this better
		return null;
	}

	return (
		<div className="flex flex-col gap-1">
			<Separator />
			<h4
				id={generateIdentifierForFile(oldRevision, newRevision)}
				className="font-bold"
			>
				{oldPath} - {newPath}
			</h4>
			<Separator />
			<Diff
				key={generateIdentifierForFile(oldRevision, newRevision)}
				viewType="unified"
				diffType={type}
				hunks={hunks}
				tokens={tokenise(hunks)}
			>
				{(hunks) =>
					hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
				}
			</Diff>
		</div>
	);
};

/**
 * TODO: make target branch part of this
 */
interface DiffViewProps
	extends Required<Omit<DiffInformation, "targetBranch">>,
		Pick<FileListProps, "onClick"> {}

export const DiffView = ({
	diffWithTarget,
	repository,
	currentBranch,
	onClick,
}: DiffViewProps) => {
	return (
		<div className="flex flex-col gap-2" key={onClick?.name}>
			<DiffSummary
				repository={repository}
				filesChanged={diffWithTarget.length}
				currentBranch={currentBranch}
			/>
			<section className="flex relative gap-2">
				<section className="flex flex-col gap-1 w-1/4 sticky top-16 max-h-screen overflow-y-auto">
					<FileList
						groupByPath
						files={diffWithTarget}
						onClick={onClick}
						initialExpandedDirs={[""]}
					/>
				</section>
				<section className="flex flex-col gap-2 flex-1">
					{diffWithTarget.map(FileDiff)}
				</section>
			</section>
		</div>
	);
};

interface DiffSummaryProps extends Omit<DiffViewProps, "diffWithTarget"> {
	/**
	 * Can be a formatted string before "files changed"
	 */
	filesChanged: number | string;
}

export const DiffSummary = ({
	repository,
	currentBranch,
	filesChanged,
}: DiffSummaryProps) => {
	return (
		<>
			<h3 className="font-bold text-lg">
				Repo at: <code>{repository.fullPathOnRemote}</code>
			</h3>
			<div className="flex flex-col gap-2 sticky top-0 py-2 z-[999]  bg-white/90 border-b border-b-sidebar-border">
				<p>
					{/** TODO: update once not limited to master branch */}
					<strong>{filesChanged}</strong> files changed compared to master
				</p>
				<p className="italic text-sm">Current branch: {currentBranch}</p>
			</div>
		</>
	);
};
