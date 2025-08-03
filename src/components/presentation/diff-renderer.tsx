import { Diff, type FileData, Hunk } from "react-diff-view";
import {
	FileList,
	type FileListProps,
} from "@/components/presentation/diff-file-list.tsx";
import { generateIdentifierForFile } from "@/components/presentation/utils.ts";
import { Card, CardHeader, CardTitle } from "@/components/shadcn/card.tsx";
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
			<Card id={generateIdentifierForFile(oldRevision, newRevision)}>
				<CardHeader>
					<CardTitle>
						{oldPath} - {newPath}
					</CardTitle>
				</CardHeader>
			</Card>
			<Diff
				key={generateIdentifierForFile(oldRevision, newRevision)}
				viewType="split"
				diffType={type}
				hunks={hunks}
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
			<h3 className="font-bold text-lg">
				Repo at: <code>{repository.fullPathOnRemote}</code>
			</h3>
			<p>
				{/** TODO: update once not limited to master branch */}
				<strong>{diffWithTarget.length}</strong> files changed compared to
				master
			</p>
			<p className="italic text-sm">Current branch: {currentBranch}</p>

			<section className="flex relative gap-2">
				<section className="flex flex-col gap-1 max-w-[300px] sticky top-0 max-h-screen overflow-y-auto">
					<FileList files={diffWithTarget} onClick={onClick} />
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
			<p>
				{/** TODO: update once not limited to master branch */}
				<strong>{filesChanged}</strong> files changed compared to master
			</p>
			<p className="italic text-sm">Current branch: {currentBranch}</p>
		</>
	);
};
