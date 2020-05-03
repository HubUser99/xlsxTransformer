"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var xlsx_1 = __importDefault(require("xlsx"));
exports.readTextFile = function (filePath) {
    var buffer = fs_1.default.readFileSync(filePath, "utf-8");
    return buffer;
};
exports.readXml = function (filePath) {
    var buffer = fs_1.default.readFileSync(filePath);
    var workBook = xlsx_1.default.read(buffer, {
        type: "buffer",
    });
    return workBook;
};
exports.xmlToJson = function (workBook) {
    var jsonObjectWithNamedSheets = {};
    workBook.SheetNames.forEach(function (sheetName) {
        var sheet = workBook.Sheets[sheetName];
        var jsonObject = xlsx_1.default.utils.sheet_to_json(sheet, {
            raw: true,
            defval: null,
        });
        var flatJsonObject = {};
        jsonObject.forEach(function (jsonObjectItem, index) {
            var jsonObjectItemValues = Object.values(jsonObjectItem);
            var jsonObjectItemKey = jsonObjectItemValues[0];
            jsonObjectItemValues.forEach(function (value, index) {
                if (index !== 0) {
                    flatJsonObject[jsonObjectItemKey] = value;
                }
            });
        });
        jsonObjectWithNamedSheets[sheetName] = flatJsonObject;
    });
    return jsonObjectWithNamedSheets;
};
exports.deepUnroll = function (object, layer) {
    if (layer === void 0) { layer = 0; }
    var unrolledObject = {};
    Object.values(object).forEach(function (value) {
    });
    return unrolledObject;
};
exports.isUnrolled = function (object, delimiter) {
    return !Object.keys(object).some(function (key) { return key.includes(delimiter); });
};
