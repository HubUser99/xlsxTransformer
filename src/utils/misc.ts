import { WorkBook } from "xlsx/types";
import fs from "fs";
import XLSX from "xlsx";
import { isNull } from "util";

export const readTextFile = (filePath: string) => {
    const buffer = fs.readFileSync(filePath, "utf-8");
    return buffer;
};

export const readXml = (filePath: string): WorkBook => {
    const buffer = fs.readFileSync(filePath);
    const workBook = XLSX.read(buffer, {
        type: "buffer",
    });

    return workBook;
};

export const xmlToJson = (workBook: WorkBook) => {
    const jsonObjectWithNamedSheets: any = {};

    workBook.SheetNames.forEach((sheetName) => {
        const sheet = workBook.Sheets[sheetName];
        const jsonObject = XLSX.utils.sheet_to_json<jsonObject>(sheet, {
            raw: true,
            defval: null,
        });

        const flatJsonObject: any = {};
        jsonObject.forEach((jsonObjectItem, index) => {
            const jsonObjectItemValues = Object.values(jsonObjectItem);
            const jsonObjectItemKey = jsonObjectItemValues[0] as string;
            jsonObjectItemValues.forEach((value, index) => {
                if (index !== 0) {
                    flatJsonObject[jsonObjectItemKey] = value
                }
            });
        });

        jsonObjectWithNamedSheets[sheetName] = flatJsonObject;
    });

    return jsonObjectWithNamedSheets;
};

export const deepUnroll = (object: jsonObject, separator: string, layer: number = 0) => {
    const unrolledObject: any = {};
    Object.entries(object).forEach(([key, value]) => {
        const unrolledObjectItem: any = {};
        Object.entries(value).forEach(([key, value]) => {
            const separatedKeys = key.split(separator);
            if (separatedKeys.length < 3) {
                unrolledObjectItem[separatedKeys[1]] = value;
            } else {
                unrolledObjectItem[separatedKeys[1]] = {
                    ...unrolledObjectItem[separatedKeys[1]],
                    [separatedKeys[2]]: typeof value === 'string' || isNull(value) ? value : deepUnroll(value, separator)
                };
            }
        });
        unrolledObject[key] = unrolledObjectItem;
    });

    return unrolledObject;
};

export const isUnrolled = (object: any, delimiter: string) => {

    return !Object.keys(object).some(key => key.includes(delimiter));
}
