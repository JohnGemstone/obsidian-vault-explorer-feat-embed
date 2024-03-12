import { App, TFile, TFolder } from "obsidian";

import React from "react";
import Card from "./card";

import "./styles.css";

interface Props {
	app: App;
}

export default function ReactView({ app }: Props) {
	const [folderPath, setFolderPath] = React.useState<string | null>(null);
	const [search, setSearch] = React.useState<string>("");
	const [onlyNext, setOnlyNext] = React.useState<boolean>(false);

	const folders = app.vault
		.getAllLoadedFiles()
		.filter((file) => file instanceof TFolder)
		.map((folder) => folder.path);

	const folderFiles = app.vault
		.getMarkdownFiles()
		.filter((file) => file instanceof TFile)
		.filter((file) => {
			if (folderPath === "") {
				return true;
			} else if (folderPath === "/") {
				return true;
			}
			return file.path.startsWith(folderPath ?? "/");
		});

	const data = app.vault
		.getMarkdownFiles()
		.filter((file) => file instanceof TFile)
		.map((file) => {
			const frontmatter = app.metadataCache.getFileCache(
				file as TFile
			)?.frontmatter;
			const tags: string[] = frontmatter?.tags ?? [];
			return {
				name: file.basename,
				path: file.path,
				tags,
				next: frontmatter?.next ?? false,
			};
		});

	const filteredData = data
		.filter((file) => {
			if (folderPath === "/") {
				return true;
			} else if (folderPath) {
				return file.path.startsWith(folderPath);
			}
			return false;
		})
		.filter((file) => {
			if (file.name.toLowerCase().includes(search.toLowerCase())) {
				return true;
			} else if (
				file.tags.some((tag) =>
					tag.toLowerCase().includes(search.toLowerCase())
				)
			) {
				return true;
			} else if (file.path.toLowerCase().includes(search.toLowerCase())) {
				return true;
			}
			return false;
		})
		.filter((file) => {
			if (onlyNext) {
				return file.next;
			}
			return true;
		});

	return (
		<div className="frontmatter-view">
			<div className="frontmatter-view-header">
				<div className="frontmatter-view-header__row">
					<input
						type="text"
						placeholder="Search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<select
						value={folderPath ?? ""}
						onChange={(e) => setFolderPath(e.target.value)}
					>
						<option value="">Select a folder</option>
						{folders.map((folder) => (
							<option key={folder} value={folder}>
								{folder === "/" ? "root" : folder}
							</option>
						))}
					</select>
				</div>
				<div className="frontmatter-view-header__row">
					<div className="frontmatter-view-checkbox">
						<label htmlFor="only-next">Only next</label>
						<input
							id="only-next"
							type="checkbox"
							checked={onlyNext}
							onChange={(e) => setOnlyNext(e.target.checked)}
						/>
					</div>
					<div>
						Showing {filteredData.length} out of{" "}
						{folderFiles.length}
					</div>
				</div>
			</div>
			<div className="frontmatter-view-list">
				{filteredData.map((file) => {
					const { name, tags } = file;
					return <Card key={file.path} name={name} tags={tags} />;
				})}
				{/* <Virtuoso
					style={{ height: 400 }}
					data={data}
					itemContent={(index, file) => <Card name={file} />}
				/> */}
			</div>
		</div>
	);
}