import fs from "fs";
import path from "path";
import {
	readXml,
	xmlToJson,
	deepUnroll,
	removeSemicolonsFromKeys,
	jsonToInterface,
} from "./utils/misc";

const main = (argv: string[]) => {
	if (argv.length !== 1) {
		console.log(`
        Wrong number of arguments!
        Usage: yarn start <path to xlsx>
        `);
		return;
    }
    
    const config = require('../config.json');
    const delimiter: string = config.delimiter;

	const xlsxFilePath = path.resolve(argv[0]);

	const workBook = readXml(xlsxFilePath);
	const jsonObject = xmlToJson(workBook);
	const unrolledJsonObject = deepUnroll(jsonObject, delimiter);

	const jsonString = JSON.stringify(unrolledJsonObject, null, 4);

	const updatedJsonString = removeSemicolonsFromKeys(jsonString);

	const interfaceString = jsonToInterface(updatedJsonString);

	fs.writeFileSync("output/test.ts", interfaceString, "utf8");
};

main(process.argv.splice(2));
