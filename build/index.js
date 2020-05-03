"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var misc_1 = require("./utils/misc");
var main = function (argv) {
    if (argv.length !== 1) {
        console.log("\n        Wrong number of arguments!\n        Usage: yarn start <path to xlsx> <path to output file>\n        ");
        return;
    }
    var xlsxFilePath = path_1.default.resolve(argv[0]);
    var workBook = misc_1.readXml(xlsxFilePath);
    var jsonObject = misc_1.xmlToJson(workBook);
    var unrolledJsonObject = misc_1.deepUnroll(jsonObject, '__');
    var jsonString = JSON.stringify(unrolledJsonObject, null, 4);
    console.log(jsonString);
    // TODO: interface name import
    var interfaceName = 'TestInterface';
    var interfaceString = "interface " + interfaceName + " " + jsonString;
    fs_1.default.writeFileSync('output/test.ts', interfaceString, 'utf8');
    console.log('Done!');
};
main(process.argv.splice(2));
