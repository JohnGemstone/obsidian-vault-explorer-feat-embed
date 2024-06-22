import { FrontMatterCache } from "obsidian";
import { FilterRule, FilterGroup, DatePropertyFilterValue } from "src/types";
import { loadPropertyValue } from "src/svelte/shared/services/load-property-value";
import { matchTextFilter } from "./match-text-filter";
import { matchCheckboxFilter } from "./match-checkbox-filter";
import { matchListFilter } from "./match-list-filter";
import { matchDateFilter } from "./match-date-filter";
import { matchNumberFilter } from "./match-number-filter";
import { getDateDaysAgo, getDateDaysAhead } from "src/svelte/shared/services/time-utils";

export const filterByGroups = (frontmatter: FrontMatterCache | undefined, groups: FilterGroup[]) => {
	return groups.every((group) => {
		if (!group.isEnabled) return true;
		return filterByGroup(frontmatter, group);
	});
}

const filterByGroup = (frontmatter: FrontMatterCache | undefined, group: FilterGroup) => {
	let result: boolean | null = null;

	group.rules.forEach((filter, i) => {
		if (!filter.isEnabled) return;

		const doesMatch = filterByRule(frontmatter, filter);
		if (result === null) {
			result = doesMatch;
		} else {
			if (filter.operator === "and") {
				result = result && doesMatch;
			} else {
				result = result || doesMatch;
			}
		}
	});

	return result ?? true;
}

const filterByRule = (frontmatter: FrontMatterCache | undefined, filter: FilterRule) => {
	const { condition, value, type, matchWhenPropertyDNE } = filter;

	if (type === "text") {
		const { propertyName } = filter;
		let propertyValue = loadPropertyValue<string>(frontmatter, propertyName, type);
		if (propertyValue) {
			propertyValue = propertyValue.toLowerCase().trim();
		}
		const compare = value.toLowerCase().trim();

		const doesMatch = matchTextFilter(propertyValue, compare, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else if (type === "number") {
		const { propertyName } = filter;
		const propertyValue = loadPropertyValue<number>(frontmatter, propertyName, type);
		const compare = parseFloat(value.trim());

		const doesMatch = matchNumberFilter(propertyValue, compare, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else if (type === "checkbox") {
		const { propertyName } = filter;
		const propertyValue = loadPropertyValue<boolean>(frontmatter, propertyName, type);

		let compare = null;
		if (value === "true") {
			compare = true;
		} else if (value === "false") {
			compare = false;
		}

		const doesMatch = matchCheckboxFilter(propertyValue, compare, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else if (type === "date" || type === "datetime") {
		const { propertyName, valueData } = filter;
		const propertyValue = loadPropertyValue<string>(frontmatter, propertyName, type);

		let compare = valueData;
		if (value === DatePropertyFilterValue.TODAY) {
			compare = getDateDaysAgo(0);
		} else if (value === DatePropertyFilterValue.YESTERDAY) {
			compare = getDateDaysAgo(1);
		} else if (value === DatePropertyFilterValue.TOMORROW) {
			compare = getDateDaysAhead(1);
		} else if (value === DatePropertyFilterValue.ONE_WEEK_AGO) {
			compare = getDateDaysAgo(7);
		} else if (value === DatePropertyFilterValue.ONE_WEEK_FROM_NOW) {
			compare = getDateDaysAhead(7);
		} else if (value === DatePropertyFilterValue.ONE_MONTH_AGO) {
			compare = getDateDaysAgo(30);
		} else if (value === DatePropertyFilterValue.ONE_MONTH_FROM_NOW) {
			compare = getDateDaysAhead(30);
		}

		const doesMatch = matchDateFilter(propertyValue, compare, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else if (type === "list") {
		const { propertyName } = filter;
		let propertyValue = loadPropertyValue<string[]>(frontmatter, propertyName, type);
		if (propertyValue) {
			propertyValue = propertyValue.map((v) => v.toLowerCase().trim());
		}
		const compare = value.trim().split(",").map((v) => v.trim()).filter((v) => v !== "");

		const doesMatch = matchListFilter(propertyValue, compare, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else {
		throw new Error(`Property filter type not supported: ${type}`);
	}
}