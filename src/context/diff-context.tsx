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
	additionalRefs: string[];
}

interface IDiffContext extends DiffInformation {
	setInformation: (newInformation: Partial<DiffInformation>) => void;
	isLoading: boolean;
	fetchRemoteRepositoryInformation: (
		repo?: RemoteRepository,
		refToCompare?: string,
	) => void;
	fetchAdditionalRefs: (repo?: RemoteRepository) => void;
}

const DEFAULT_VALUES: IDiffContext = {
	diffWithTarget: [],
	targetBranch: "master",
	currentBranch: "",
	setInformation: () => {},
	fetchRemoteRepositoryInformation: () => {},
	isLoading: false,
	additionalRefs: [],
	fetchAdditionalRefs: () => {},
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

	const fetchAdditionalRefs = useCallback(
		async (repo?: RemoteRepository) => {
			if (!repo || isLoading) return;
			setIsLoading(true);
			// TODO: implement
		},
		[isLoading],
	);

	const fetchRemoteRepositoryInformation = useCallback(
		// TODO: complete customisable ref
		async (repo?: RemoteRepository, refToCompare?: string) => {
			if (!repo || isLoading) return;
			setIsLoading(true);
			try {
				const repoController = new RemoteRepositoryController(
					repo.host,
					repo.workingDirectory,
				);
				const branchResult = await repoController.getCurrentGitBranch();
				const currentBranch =
					branchResult.status === "ok" ? branchResult.data.output : "HEAD";

				const diffResult = await repoController.getMergePreviewWithTargetBranch(
					information.targetBranch,
					currentBranch,
				);
				updateInformation({
					currentBranch: refToCompare ?? currentBranch,
					diffWithTarget:
						diffResult.status === "ok"
							? parseDiff(diffResult.data.output || "")
							: undefined,
					repository: repo,
				});
			} catch (error) {
				console.error("Error fetching repository information:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[updateInformation, isLoading, information],
	);

	return (
		<DiffContext.Provider
			value={{
				...information,
				setInformation: updateInformation,
				fetchRemoteRepositoryInformation,
				fetchAdditionalRefs,
				isLoading,
			}}
		>
			{children}
		</DiffContext.Provider>
	);
};
