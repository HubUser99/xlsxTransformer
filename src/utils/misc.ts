import { WorkBook } from "xlsx/types";
import fs from "fs";
import XLSX from "xlsx";
import { isNull } from "util";

/**
 *
 * @param filePath string
 *
 * Returns string representation of a file, located by the provided path.
 * Encoding: UTF-8
 */
export const readTextFile = (filePath: string): string => {
	const fileDataString = fs.readFileSync(filePath, "utf-8");
	return fileDataString;
};

/**
 *
 * @param filePath string
 *
 * Returns WorkBook representation of a XLSX file, located by the provided path.
 */
export const readXml = (filePath: string): WorkBook => {
	const buffer = fs.readFileSync(filePath);
	const workBook = XLSX.read(buffer, {
		type: "buffer",
	});

	return workBook;
};

/**
 * 
 * @param workBook WorkBook
 * 
 * Returns JsonObject constructed from WorkBook.
 * 
 * Default value for null/undefined: null
 */
export const xmlToJson = (workBook: WorkBook): JsonObject => {
	const jsonObjectWithNamedSheets: JsonObject = {};

	workBook.SheetNames.forEach((sheetName) => {
		const sheet = workBook.Sheets[sheetName];
		const jsonObject = XLSX.utils.sheet_to_json<JsonObject>(sheet, {
			raw: true,
			defval: null,
		});

		const flatJsonObject: JsonObject = {};
		jsonObject.forEach((jsonObjectItem, index) => {
			const jsonObjectItemValues = Object.values(jsonObjectItem);
			const jsonObjectItemKey = jsonObjectItemValues[0] as string;
			jsonObjectItemValues.forEach((value, index) => {
				if (index !== 0) {
					flatJsonObject[jsonObjectItemKey] = value;
				}
			});
		});

		jsonObjectWithNamedSheets[sheetName] = flatJsonObject;
	});

	return jsonObjectWithNamedSheets;
};

/**
 * 
 * @param object JsonObject
 * @param separator string
 * 
 * Returns object with "unrolled" structure basing on key values.
 * 
 * Example:
 * 
 * Input:
 * 
 *  object: { "food__fruit__apple": "Apple" }
 * 
 *  separator: "__"
 * 
 * Output:
 * 
 *  { "food": { "fruit": { "apple": "Apple" } } }
 */
export const deepUnroll = (object: JsonObject, separator: string) => {
	const unrolledObjectItem: any = {};
	Object.entries(object).forEach(([key, value]) => {
		const separatedKeys = key.split(separator);
		if (separatedKeys.length === 1) {
			unrolledObjectItem[separatedKeys[0]] =
				typeof value === "string" || isNull(value)
					? value
					: deepUnroll(value, separator);
		} else if (separatedKeys.length < 3) {
			/**
			 * TODO: remove workaround for the excel structure
			 * Now separatedKeys.length is equals to 2, because of '|' leading character
			 * The algorithm should be based on consistent separator string and should not contain any extra characters
			 *
			 * Possible actions: remove second condition completely
			 */
			unrolledObjectItem[separatedKeys[1]] = value;
		} else {
			unrolledObjectItem[separatedKeys[1]] = {
				...unrolledObjectItem[separatedKeys[1]],
				[separatedKeys[2]]:
					typeof value === "string" || isNull(value)
						? value
						: deepUnroll(value, separator),
			};
		}
	});

	return unrolledObjectItem;
};

/**
 * 
 * @param jsonString string
 * 
 * Removes semicolons surrouding keys of the object.
 * 
 * Example:
 * 
 * Input:
 * 
 *  "{ "key": "value" }"
 * 
 * Output:
 * 
 *  "{ key: "value" }"
 */
export const removeSemicolonsFromKeys = (jsonString: string) => {
	const lines = jsonString.split(/\r?\n/);

	const newLines = lines.map((line) => {
		const indexOfFirst = line.indexOf('"');
		const indexOfSecond = line.indexOf('"', indexOfFirst + 1);

		const checkStr = line.substr(
			indexOfFirst,
			indexOfSecond - indexOfFirst
		);

		return checkStr.includes("-") || checkStr.includes(" ")
			? line
			: line.replace('"', "").replace('"', "");
	});

	const newString = newLines.join("\n");

	return newString;
};

/**
 * 
 * @param jsonString string
 * 
 * Transforms json string according to TypeScript Interface style
 */
export const jsonToInterface = (jsonString: string) => {
	// TODO: get interface name as parameter
	const interfaceName = "TestInterface";

	return `interface ${interfaceName} ${jsonString}`;
};
