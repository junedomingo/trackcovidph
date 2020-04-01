import moment from 'moment';
import fs from 'fs';
import * as dotenv from 'dotenv';

import { ArcGISResponse } from '../types';
import { NULLABLE_VALUES, WORDS_TO_REPLACE, ARCGIS_DATE_FORMAT } from '../conts';

dotenv.config();

export function sanitizeResponse<T>(response: ArcGISResponse<T>): ArcGISResponse<T> {
  response.features.map(({ attributes: attrs }: any) => {
    Object.keys(attrs).map(key => {
      if (typeof attrs[key] == 'string') {
        attrs[key] = attrs[key].trim() || null;

        if (NULLABLE_VALUES.includes(attrs[key])) {
          attrs[key] = null;
        }

        if (attrs[key] !== null) {
          WORDS_TO_REPLACE.forEach(word => {
            const wordToSearch = new RegExp(word.search, 'gi');
            if (attrs[key].search(wordToSearch)) {
              attrs[key] = attrs[key].replace(wordToSearch, word.replace);
            }
          });
        }
      }
      attrs[key] = attrs[key];
    });
  });
  return response;
}

export function parseToJSON<T>(response: string): ArcGISResponse<T> {
  return JSON.parse(response);
}

export function toDate(date: string, format: string = ARCGIS_DATE_FORMAT): string {
  return moment(date, format).toISOString();
}

export function toAge(age: string): number {
  return parseInt(age);
}

export function isDevEnv() {
  return process.env.NODE_ENV === 'development';
}

export function isDummy() {
  return process.env.DATA_RESOURCE === 'dummy';
}

export function getDummyData(path: string) {
  const buffer = fs.readFileSync(`${path}`);
  return String(buffer);
}

export function getUnique(arr: any, key: string): any {
  return [...new Map(arr.map((item: any) => [item[key], item])).values()];
}

export function isContainNum(str: string) {
  return str.match(/\d+/g);
}

export function getNextStr(findInStr: string, toSearchStr: string) {
  return findInStr.match(toSearchStr + '\\s(\\w+)');
}
