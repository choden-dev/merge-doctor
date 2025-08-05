import { useDebounce, useLocalStorage, useMap } from "@uidotdev/usehooks";
import { Play, PlusIcon, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FileData } from "react-diff-view";
import { FileList } from "@/components/presentation/diff/diff-file-list.tsx";
import { FileFilterControls } from "@/components/presentation/file-filter-controls.tsx";
import { Button } from "@/components/shadcn/button.tsx";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card.tsx";
import { Checkbox } from "@/components/shadcn/checkbox.tsx";
import { Input } from "@/components/shadcn/input.tsx";
import { Label } from "@/components/shadcn/label.tsx";
import { Separator } from "@/components/shadcn/separator.tsx";
import { Skeleton } from "@/components/shadcn/skeleton.tsx";
import { useDiffContext } from "@/context/diff-context.tsx";
import { RemoteRepositoryController } from "@/controllers/remote-repository.ts";
import { useFileFilter } from "@/hooks/use-file-filter.tsx";
import { useSet } from "@/hooks/use-set.tsx";

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

	// Command -> output
	const commandOutput = useMap<string>();
	const [currentlyExecutingCommand, setCurrentlyExecutingCommand] = useState<
		string | undefined
	>(undefined);

	useEffect(() => {
		return () => setCurrentlyExecutingCommand(undefined);
	}, []);

	if (!repository) {
		return null;
	}

	// TODO: extract out command running logic
	const handleRunCommand = async (command: string) => {
		setCurrentlyExecutingCommand(command);
		new RemoteRepositoryController(repository.host, repository.workingDirectory)
			.runFreeformCommand(command)
			.then((result) => {
				if (!result.success) {
					commandOutput.set(command, result.error);
				} else {
					commandOutput.set(command, result.output);
				}
			})
			.finally(() => {
				setCurrentlyExecutingCommand(undefined);
			});
	};

	return (
		<>
			<div className="flex flex-col gap-2 py-4">
				<h2 className="text-2xl">Saved commands for {name}</h2>
				{savedCommands.length > 0 ? (
					savedCommands.map((command) => (
						<Card key={command}>
							<CardHeader>
								<CardTitle>
									<code>{command}</code>
								</CardTitle>
								<CardAction className=" flex gap-2">
									<Button
										disabled={!!currentlyExecutingCommand}
										onClick={() => handleRunCommand(command)}
									>
										<Play />
									</Button>
									<Button
										disabled={!!currentlyExecutingCommand}
										variant="destructive"
										onClick={() => handleDeleteCommand(command)}
									>
										<Trash />
									</Button>
								</CardAction>
							</CardHeader>
							<CardContent>
								<CardDescription>{commandOutput.get(command)}</CardDescription>
								{currentlyExecutingCommand === command && (
									<Skeleton className="w-full h-1" />
								)}
							</CardContent>
						</Card>
					))
				) : (
					<p>No commands yet!</p>
				)}
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
							groupByPath
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
