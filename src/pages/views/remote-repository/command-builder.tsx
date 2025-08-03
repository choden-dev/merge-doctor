import { FileList } from "@/components/presentation/diff-file-list.tsx";
import { FileFilterControls } from "@/components/presentation/file-filter-controls.tsx";
import { useDiffContext } from "@/context/diff-context.tsx";
import { useFileFilter } from "@/hooks/use-file-filter.tsx";
import { Input } from "@/components/shadcn/input.tsx";
import { Button } from "@/components/shadcn/button.tsx";
import { Separator } from "@/components/shadcn/separator.tsx";
import { Play, PlusIcon, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Checkbox } from "@/components/shadcn/checkbox.tsx";
import { Label } from "@/components/shadcn/label.tsx";
import { useSet } from "@/hooks/use-set.tsx";
import type { FileData } from "react-diff-view";
import { useDebounce, useLocalStorage } from "@uidotdev/usehooks";
import {
	Card,
	CardAction,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card.tsx";

interface CommandBuilderSteps {
	directory: string;
	baseCommand: string;
	files?: string[];
	delimiter?: string;
}

const DEBOUNCE_MS = 200;

interface RepositoryCommandBuilderProps {
	name: string;
	localStorageKey: string;
}

export const RepositoryCommandBuilder = ({
	name,
	localStorageKey,
}: RepositoryCommandBuilderProps) => {
	const { diffWithTarget, repository } = useDiffContext();

	const [currentBuiltCommand, setCurrentBuiltCommand] =
		useState<CommandBuilderSteps>({
			directory: "",
			baseCommand: "",
		});

	const [savedCommands, setSavedCommands] = useLocalStorage<string[]>(
		localStorageKey,
		[],
	);

	const [isUsingFiles, setIsUsingFiles] = useState(false);

	const debouncedBuiltCommand = useDebounce(currentBuiltCommand, DEBOUNCE_MS);

	const {
		add: addFile,
		has: listHasFile,
		remove: removeFile,
		set: filesSet,
	} = useSet<string>();

	const strippedFileNames = useMemo(
		() =>
			isUsingFiles
				? [...filesSet].map((file) =>
						file
							.trim()
							.replace(
								new RegExp(`^/?${debouncedBuiltCommand.directory}/?`),
								"",
							),
					)
				: [],
		[isUsingFiles, debouncedBuiltCommand, filesSet],
	);

	const handleFileClicked = useCallback(
		(file: FileData) => {
			// TODO: consistent id
			if (listHasFile(file.newPath)) {
				removeFile(file.newPath);
			} else {
				addFile(file.newPath);
			}
		},
		[removeFile, listHasFile, addFile],
	);

	const isCommandValid =
		!!debouncedBuiltCommand.baseCommand.length &&
		!debouncedBuiltCommand.directory.includes(" ");

	const { filteredFiles, searchQuery, setSearchQuery, filterTypes } =
		useFileFilter({
			initialFiles: diffWithTarget,
		});

	const finalCommand = useMemo(
		() =>
			`cd ${debouncedBuiltCommand.directory} && ${debouncedBuiltCommand.baseCommand} ${strippedFileNames.join(" ")}`,
		[debouncedBuiltCommand, strippedFileNames],
	);

	const handleDeleteCommand = useCallback(
		(commandToDelete: string) => {
			setSavedCommands(
				savedCommands.filter((command) => command !== commandToDelete),
			);
		},
		[savedCommands, setSavedCommands],
	);

	const handleAddCommand = useCallback(
		(commandToAdd: string) => {
			if (savedCommands.includes(commandToAdd.trim()) || !isCommandValid)
				return;
			setSavedCommands([...savedCommands, commandToAdd.trim()]);
		},
		[savedCommands, setSavedCommands, isCommandValid],
	);

	if (!repository) {
		return null;
	}
	return (
		<>
			<div className="flex flex-col gap-2 py-4">
				<h2 className="text-2xl">Saved commands for {name}</h2>
				{savedCommands.map((command) => (
					<Card key={command}>
						<CardHeader>
							<CardTitle>
								<code>{command}</code>
							</CardTitle>
							<CardAction className=" flex gap-2">
								<Button>
									<Play />
								</Button>
								<Button
									variant="destructive"
									onClick={() => handleDeleteCommand(command)}
								>
									<Trash />
								</Button>
							</CardAction>
						</CardHeader>
					</Card>
				))}
			</div>
			<Separator />
			<h3 className="font-bold my-2 text-xl">Command Builder</h3>
			<h4 className="font-bold mb-2">Add command</h4>
			<div className="flex gap-2 w-fit mb-2">
				<Input
					placeholder="Directory to run"
					onChange={(e) =>
						setCurrentBuiltCommand({
							...currentBuiltCommand,
							directory: e.currentTarget.value,
						})
					}
				/>
				<Input
					placeholder="Base command"
					onChange={(e) =>
						setCurrentBuiltCommand({
							...currentBuiltCommand,
							baseCommand: e.currentTarget.value,
						})
					}
				/>
				<Button
					disabled={!isCommandValid}
					onClick={() => handleAddCommand(finalCommand)}
				>
					<PlusIcon />
				</Button>
			</div>
			<div className="flex items-start gap-3">
				<Checkbox
					id="terms-2"
					defaultChecked={isUsingFiles}
					disabled={!isCommandValid}
					onCheckedChange={(checked) =>
						setIsUsingFiles(checked !== "indeterminate" ? checked : false)
					}
				/>
				<div className="grid gap-2">
					<Label htmlFor="terms-2">Add specific files as arguments?</Label>
					<p className="text-muted-foreground text-sm"></p>
				</div>
			</div>
			{isCommandValid && (
				<>
					<Separator />
					<code>
						<strong>Command Preview:</strong> {finalCommand}
					</code>
					<Separator />
				</>
			)}
			{isUsingFiles && (
				<>
					<h4 className="font-bold mb-2">Files/directories to run command</h4>
					<FileFilterControls
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						filterTypes={filterTypes}
					/>
					<div className="sm:grid-cols-1 md:grid-cols-2 grid-cols-3 grid gap-1 mt-2">
						<FileList
							files={filteredFiles}
							onClick={handleFileClicked}
							selectedFiles={[...filesSet]}
						/>
					</div>
				</>
			)}
		</>
	);
};
