import { useDebounce } from "@uidotdev/usehooks";
import { useMemo, useState } from "react";
import type { FileData } from "react-diff-view";
import { useSet } from "@/hooks/use-set";

export const DEBOUNCE_MS = 200;

export interface UseFileFilterOptions {
	initialFiles: FileData[];
	debounceMs?: number;
}

export interface UseFileFilterResult {
	filteredFiles: FileData[];
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	filterTypes: {
		add: (type: FileData["type"]) => void;
		remove: (type: FileData["type"]) => void;
		has: (type: FileData["type"]) => boolean;
		set: Set<FileData["type"]>;
	};
}

export function useFileFilter({
	initialFiles,
	debounceMs = DEBOUNCE_MS,
}: UseFileFilterOptions): UseFileFilterResult {
	const [searchQuery, setSearchQuery] = useState("");
	const { add, remove, has, set } = useSet<FileData["type"]>();

	const debouncedSearchQuery = useDebounce(searchQuery, debounceMs);

	const filteredFiles = useMemo(() => {
		if (!debouncedSearchQuery.trim().length && !set.size) {
			return initialFiles;
		}
		return initialFiles.filter((file) => {
			return (
				file.newPath
					.trim()
					.toLowerCase()
					.includes(debouncedSearchQuery.trim().toLowerCase()) &&
				(!set.size || has(file.type))
			);
		});
	}, [debouncedSearchQuery, initialFiles, has, set]);

	return {
		filteredFiles,
		searchQuery,
		setSearchQuery,
		filterTypes: {
			add,
			remove,
			has,
			set,
		},
	};
}
