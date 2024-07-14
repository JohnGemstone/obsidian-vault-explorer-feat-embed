import { Menu } from "obsidian";
import VaultExplorerPlugin from "src/main";

export const openContextMenu = (
	plugin: VaultExplorerPlugin,
	e: MouseEvent,
	filePath: string
) => {
	const menu = new Menu();
	menu.setUseNativeMenu(true);
	menu.addItem((item) => {
		item.setTitle("Open in new tab");
		item.onClick(() => openInNewTab(plugin, filePath));
	});
	menu.addItem((item) => {
		item.setTitle("Open to the right");
		item.onClick(() => openToTheRight(plugin, filePath));
	});
	menu.addItem((item) => {
		item.setTitle("Open in new window");
		item.onClick(() => openInNewWindow(plugin, filePath));
	});
	menu.showAtMouseEvent(e);
};

const openToTheRight = (plugin: VaultExplorerPlugin, filePath: string) => {
	plugin.app.workspace.openLinkText("", filePath, "split", {
		active: false,
	});
};

const openInNewTab = (plugin: VaultExplorerPlugin, filePath: string) => {
	plugin.app.workspace.openLinkText("", filePath, "tab", {
		active: false,
	});
};

const openInNewWindow = (plugin: VaultExplorerPlugin, filePath: string) => {
	plugin.app.workspace.openLinkText("", filePath, "window");
};