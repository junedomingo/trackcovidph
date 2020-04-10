/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';
import fs from 'fs';
import * as dotenv from 'dotenv';
import countries from 'i18n-iso-countries';

import { ArcGISResponse, Cache } from '../types/interfaces';
import { NULLABLE_VALUES, WORDS_TO_REPLACE, ARCGIS_DATE_FORMAT } from '../conts';
import { redis } from '../config';

dotenv.config();

export const countryNames = Object.values(countries.getNames('en'));

export function sanitizeResponse<T>(response: ArcGISResponse<T>): ArcGISResponse<T> {
  response.features.map(({ attributes: attrs }: any) => {
    Object.keys(attrs).map((key) => {
      if (typeof attrs[key] == 'string') {
        attrs[key] = attrs[key].trim() || null;

        if (NULLABLE_VALUES.includes(attrs[key])) {
          attrs[key] = null;
        }

        if (attrs[key] !== null) {
          for (const word of WORDS_TO_REPLACE) {
            const wordToSearch = new RegExp(word.search, 'gi');
            if (wordToSearch.test(attrs[key])) {
              attrs[key] = attrs[key].replace(wordToSearch, word.replace);
            }
          }
        }
      }
      attrs[key] = attrs[key];
    });
  });

  return response;
}

export function parseToJSON<T>(response: string): T {
  return JSON.parse(response);
}

/**
 * Convert input date into moment ISOString
 * @param date eg. 1/30/2020
 * @param format 'M/D/YYYY' as default
 */
export function toDate(date: string, format: string = ARCGIS_DATE_FORMAT): string {
  return moment(date, format).toISOString(true);
}

export function toAge(age: string): number {
  return parseInt(age);
}

export function toNationality(str: string): string[] {
  return str ? str.split(', ') : [];
}

export function toSymptoms(str: string): string[] {
  return str ? str.split(', ') : [];
}

export function toTravelHistory(str: string): string[] {
  const travelHistory = [];

  if (str) {
    for (const country of countryNames) {
      const matches = str.matchAll(new RegExp(country, 'gi'));
      const allMatch = Array.from(matches);
      const matchValue = allMatch[0];

      if (matchValue) {
        travelHistory.push(matchValue[0]);
      }
    }

    return travelHistory;
  }

  return [];
}

export function isDevEnv(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProdEnv(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDummy(): boolean {
  return process.env.DATA_RESOURCE === 'dummy';
}

export function getDummyData(path: string): string {
  const buffer = fs.readFileSync(`${path}`);
  return buffer.toString();
}

export function getUnique<T>(arr: T[], key: string): T[] {
  return [...new Map(arr.map((item: any) => [item[key], item])).values()];
}

export function isContainNum(str: string): RegExpMatchArray | null {
  return str.match(/\d+/g);
}

export function getNextStr(findInStr: string, toSearchStr: string): RegExpMatchArray | null {
  return findInStr.match(toSearchStr + '\\s(\\w+)');
}

export function log(message: string): void | undefined {
  return isDevEnv() ? console.log(message) : undefined;
}

export async function getCache<T>(key: string): Promise<Cache<T> | null> {
  const value = await redis.get(key);

  return value
    ? {
        json: parseToJSON(value),
        raw: value,
      }
    : null;
}
