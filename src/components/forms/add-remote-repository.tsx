import { useCallback, useState } from "react";
import { normalisePaths } from "@/components/forms/utils.ts";
import { Button } from "@/components/shadcn/button.tsx";
import { Input } from "@/components/shadcn/input.tsx";
import { Label } from "@/components/shadcn/label.tsx";
import { FieldLabelContainer } from "@/components/styling/field-label-container.tsx";
import { FormContainer } from "@/components/styling/form-container.tsx";
import {
	RemoteRepositoryController,
	useRemoteRepositories,
} from "@/controllers/remote-repository.ts";
import type { RemoteRepository } from "@/types/repository.ts";

interface AddRemoteRepositoryFormState {
	remoteHost?: string;
	workingDirectory?: string;
}

const GENERIC_ERROR =
	"Failed to add the new repository. Make sure your ssh host is up and running and the working directory exists." as const;

const validateRemoteRepoDoesntAlreadyExist = (
	toAdd: RemoteRepository,
	existing: RemoteRepository[],
) => {
	const { host, workingDirectory, fullPathOnRemote } = toAdd;
	return !existing.some(
		(repo) =>
			repo.host === host &&
			repo.workingDirectory === workingDirectory &&
			repo.fullPathOnRemote === fullPathOnRemote,
	);
};

export const AddRemoteRepositoryForm = () => {
	const [formState, setFormState] = useState<AddRemoteRepositoryFormState>({});
	const [error, setError] = useState<Error | null>(null);
	const [currentRepositories, addRemoteRepository] = useRemoteRepositories();

	const { remoteHost, workingDirectory } = formState;
	const isValid = remoteHost && workingDirectory;
	const commandToRun = `ssh ${remoteHost} "cd ${workingDirectory} && git rev-parse --show-toplevel"`;

	const handleAddRepo = useCallback(async () => {
		if (!isValid) return;
		setError(null);

		try {
			const output = await new RemoteRepositoryController(
				remoteHost,
				workingDirectory,
			).checkRepositoryHealth();

			if (output.success && output.output) {
				const toAdd: RemoteRepository = {
					id: normalisePaths(remoteHost) + normalisePaths(workingDirectory),
					host: remoteHost,
					workingDirectory,
					fullPathOnRemote: output.output,
				};

				if (!validateRemoteRepoDoesntAlreadyExist(toAdd, currentRepositories)) {
					setError(new Error("Repository already exists!"));
					return;
				}

				addRemoteRepository([...currentRepositories, toAdd]);
			} else {
				setError(new Error(output.error || GENERIC_ERROR));
			}
		} catch (e) {
			setError(e instanceof Error ? e : new Error(GENERIC_ERROR));
		}
	}, [
		addRemoteRepository,
		currentRepositories,
		isValid,
		remoteHost,
		workingDirectory,
	]);

	const handleInputChange =
		(field: keyof AddRemoteRepositoryFormState) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFormState({ ...formState, [field]: e.target.value });
		};

	return (
		<FormContainer>
			<FieldLabelContainer>
				<Label htmlFor="remote-host">Host</Label>
				<Input
					id="remote-host"
					placeholder="`host` in ssh <host>"
					onChange={handleInputChange("remoteHost")}
				/>
			</FieldLabelContainer>
			<FieldLabelContainer>
				<Label htmlFor="remote-working-dir">Working Directory</Label>
				<Input
					id="remote-working-dir"
					placeholder="`cd` location after ssh <host>"
					onChange={handleInputChange("workingDirectory")}
				/>
			</FieldLabelContainer>
			{isValid && (
				<>
					<p className="text-sm">If a repository exists after running</p>
					<code className="text-sm">{commandToRun}</code>
				</>
			)}
			<Button disabled={!isValid} onClick={handleAddRepo}>
				Open Repo
			</Button>
			<p className="text-sm">{error?.message}</p>
		</FormContainer>
	);
};
