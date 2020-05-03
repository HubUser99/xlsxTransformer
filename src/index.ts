import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { readXml, xmlToJson } from "./utils/misc";

const main = (argv: string[]) => {
    if (argv.length !== 1) {
        console.log(`
        Wrong number of arguments!
        Usage: yarn start <path to xlsx> <path to output file>
        `);
        return;
    }

    const xlsxFilePath = path.resolve(argv[0]);
    
    const workBook = readXml(xlsxFilePath);
    const jsonObject = xmlToJson(workBook);
    // const unrolledJsonObject = deepUnroll(jsonObject);

    const jsonString = JSON.stringify(jsonObject, null, 4);

    console.log(jsonString);
    

    // TODO: interface name import
    const interfaceName = 'TestInterface';

    const interfaceString = `interface ${interfaceName} ${jsonString}`;

    fs.writeFileSync('output/test.ts', interfaceString, 'utf8');

    console.log('Done!');
};

main(process.argv.splice(2));
