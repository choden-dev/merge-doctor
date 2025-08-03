import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppLayout } from "@/components/layout/app-layout.tsx";
import {
	LS_STORED_FORMATTING_COMMANDS,
	LS_STORED_TEST_COMMANDS,
	LS_STORED_TYPECHECK_COMMANDS,
} from "@/constants/local-storage-keys.ts";
import { VALID_ROUTES } from "@/constants/routes.ts";
import { DiffContextProvider } from "@/context/diff-context.tsx";
import { AddRepositoryPage } from "@/pages/add-repository.tsx";
import { LandingPage } from "@/pages/landing.tsx";
import { RemoteRepositoryPage } from "@/pages/remote-repository.tsx";
import { RepositoryCommandBuilder } from "@/pages/views/remote-repository/command-builder.tsx";
import { RemoteRepositoryMergePreview } from "@/pages/views/remote-repository/merge-preview.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<Route path={VALID_ROUTES.DEFAULT_ROUTE} element={<LandingPage />} />
					<Route
						path={VALID_ROUTES.ADD_REPO_ROUTE}
						element={<AddRepositoryPage />}
					/>

					<Route path={VALID_ROUTES.REMOTE_REPOSITORY_ROUTE}>
						<Route
							index
							element={<Navigate to={VALID_ROUTES.DEFAULT_ROUTE} />}
						/>
						<Route
							path=":id"
							element={
								<DiffContextProvider>
									<RemoteRepositoryPage />
								</DiffContextProvider>
							}
						>
							<Route index element={<RemoteRepositoryMergePreview />} />
							<Route
								path={`${VALID_ROUTES.REMOTE_REPOSITORY_ROUTE}/:id/type-check`}
								element={
									<RepositoryCommandBuilder
										name={"Type Check"}
										localStorageKey={LS_STORED_TYPECHECK_COMMANDS}
									/>
								}
							/>
							<Route
								path={`${VALID_ROUTES.REMOTE_REPOSITORY_ROUTE}/:id/format`}
								element={
									<RepositoryCommandBuilder
										name={"Formatting"}
										localStorageKey={LS_STORED_FORMATTING_COMMANDS}
									/>
								}
							/>
							<Route
								path={`${VALID_ROUTES.REMOTE_REPOSITORY_ROUTE}/:id/tests`}
								element={
									<RepositoryCommandBuilder
										name={"Tests"}
										localStorageKey={LS_STORED_TEST_COMMANDS}
									/>
								}
							/>
						</Route>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);
