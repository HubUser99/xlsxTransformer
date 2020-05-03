"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var xlsx_1 = __importDefault(require("xlsx"));
var util_1 = require("util");
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
exports.deepUnroll = function (object, separator, layer) {
    if (layer === void 0) { layer = 0; }
    var unrolledObject = {};
    Object.entries(object).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        var unrolledObjectItem = {};
        Object.entries(value).forEach(function (_a) {
            var _b;
            var key = _a[0], value = _a[1];
            var separatedKeys = key.split(separator);
            if (separatedKeys.length < 3) {
                unrolledObjectItem[separatedKeys[1]] = value;
            }
            else {
                unrolledObjectItem[separatedKeys[1]] = __assign(__assign({}, unrolledObjectItem[separatedKeys[1]]), (_b = {}, _b[separatedKeys[2]] = typeof value === 'string' || util_1.isNull(value) ? value : exports.deepUnroll(value, separator), _b));
            }
        });
        unrolledObject[key] = unrolledObjectItem;
    });
    return unrolledObject;
};
exports.isUnrolled = function (object, delimiter) {
    return !Object.keys(object).some(function (key) { return key.includes(delimiter); });
};
