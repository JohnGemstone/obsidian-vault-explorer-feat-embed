export enum PluginEvent {
	FILE_RENAME = "file-rename",
	FILE_CREATE = "file-create",
	FILE_DELETE = "file-delete",
	FILE_MODIFY = "file-modify",
	METADATA_CHANGE = "metadata-change",
	PROPERTIES_FILTER_UPDATE = "properties-filter-update",
	FOLDER_RENAME = "folder-rename",
	FOLDER_DELETE = "folder-delete",
	FOLDER_CREATE = "folder-create",
	PAGE_SIZE_SETTING_CHANGE = "page-size-setting-change",
	TITLE_WRAPPING_SETTING_CHANGE = "title-wrapping-setting-change",
	PROPERTY_SETTING_CHANGE = "property-setting-change",
	DEVICE_REGISTRATION_CHANGE = "device-registration-change",
	CLOCK_UPDATES_SETTING_CHANGE = "clock-updates-setting-change",
	FILTER_TOGGLE_SETTING_CHANGE = "filter-toggle-setting-change",
	SCROLL_BUTTONS_SETTING_CHANGE = "scroll-buttons-setting-change",
	VIEW_TOGGLE_SETTING_CHANGE = "view-toggle-setting-change",
	FILE_ICONS_SETTING_CHANGE = "file-icons-setting-change",
	FILTER_GROUPS_WRAPPING_SETTING_CHANGE = "filter-groups-wrapping-setting-change",
	LOAD_SOCIAL_MEDIA_IMAGE_SETTING_CHANGE = "load-social-media-image-setting-change",
}

export type EventCallback = (...data: unknown[]) => void;
