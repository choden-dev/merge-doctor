import { createContext, useCallback, useContext, useState } from "react";
import { type FileData, parseDiff } from "react-diff-view";
import type { WithChildren } from "@/components/styling/styling-util-types.tsx";
import { RemoteRepositoryController } from "@/controllers/remote-repository.ts";
import type { RemoteRepository } from "@/types/repository.ts";

export interface DiffInformation {
	diffWithTarget: FileData[];
	/**
	 * TODO: investigate if its feasible to programatically find this
	 */
	targetBranch: "master" | "main";
	currentBranch: string;
	repository?: RemoteRepository; // TODO: add support for local repos
}

interface IDiffContext extends DiffInformation {
	setInformation: (newInformation: Partial<DiffInformation>) => void;
	isLoading: boolean;
	fetchRemoteRepositoryInformation: (repo?: RemoteRepository) => void;
}

const DEFAULT_VALUES: IDiffContext = {
	diffWithTarget: [],
	targetBranch: "master",
	currentBranch: "",
	setInformation: () => {},
	fetchRemoteRepositoryInformation: () => {},
	isLoading: false,
} as const;

const DiffContext = createContext<IDiffContext | undefined>(undefined);

export const useDiffContext = () => {
	const context = useContext(DiffContext);

	if (context === undefined) {
		throw new Error("useDiffContext MUST be used in a DiffContextProvider");
	}

	return context;
};

export const DiffContextProvider = ({ children }: WithChildren) => {
	const [information, setInformation] = useState(DEFAULT_VALUES);
	const [isLoading, setIsLoading] = useState(false);

	const updateInformation = useCallback((newData: Partial<DiffInformation>) => {
		setInformation((prev) => ({ ...prev, ...newData }));
	}, []);

	const fetchRemoteRepositoryInformation = useCallback(
		async (repo?: RemoteRepository) => {
			if (!repo || isLoading) return;
			setIsLoading(true);
			try {
				const repoController = new RemoteRepositoryController(
					repo.host,
					repo.workingDirectory,
				);
				const [branchResult, diffResult] = await Promise.all([
					repoController.getCurrentGitBranch(),
					repoController.getDiffForPreviewMergeWithMaster(),
				]);
				updateInformation({
					currentBranch: branchResult.output,
					diffWithTarget: parseDiff(diffResult.output || ""),
					repository: repo,
				});
			} catch (error) {
				console.error("Error fetching repository information:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[updateInformation, isLoading],
	);

	return (
		<DiffContext.Provider
			value={{
				...information,
				setInformation: updateInformation,
				fetchRemoteRepositoryInformation,
				isLoading,
			}}
		>
			{children}
		</DiffContext.Provider>
	);
};
