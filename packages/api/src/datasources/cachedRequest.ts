/* eslint-disable @typescript-eslint/no-explicit-any */
import { redis } from '../config';
import { log, parseToJSON, getDummyData } from '../utils';
import { CACHE_TTL, ENDPOINTS } from '../conts';
import { ArcGISResponse, ArcGISCountAttrs } from '../types/interfaces';

export async function cachedRequest(
  api: any,
  resourceUrl: string,
  key: string,
  isDummy = false,
  maxAge: number = CACHE_TTL,
  method = 'get'
): Promise<{ data: string }> {
  const requestUrl = `${api.baseURL}${resourceUrl}`;
  const httpCacheKey = key;
  const dummyCacheKey = `dummy:${key}`;
  const cachedResponse = await redis.get(isDummy ? dummyCacheKey : httpCacheKey);
  const cacheKey = isDummy ? dummyCacheKey : httpCacheKey;

  if (cachedResponse) {
    log(`Fetching "${key}" data from cache.`);
    return parseToJSON(cachedResponse);
  } else {
    const response = { data: '' };

    if (isDummy) {
      response.data = getDummyData(`${__dirname}/${resourceUrl}`);
    } else {
      if (['confirmed_locals'].includes(key)) {
        const countsResponse: string = await api.get(ENDPOINTS.ARCGIS_COUNTS);
        const counts: ArcGISResponse<ArcGISCountAttrs> = await parseToJSON(countsResponse);
        const confirmedCount = counts.features.map(({ attributes: attrs }) => attrs.confirmed)[0];

        const features: any = [];
        const aa = await parseToJSON(await api[method](requestUrl));

        for (let offset = 0; offset < Number(confirmedCount); offset += 2000) {
          const url = requestUrl.replace('resultOffset=0', `resultOffset=${offset}`);
          const parsedData: ArcGISResponse<any> = parseToJSON(await api[method](url));
          features.push(parsedData.features.map((f) => f));
        }

        const flattenedFeatures = features.flat();
        const cc = Object.assign({}, await aa, { features: flattenedFeatures });
        response.data = JSON.stringify(cc);
      } else {
        response.data = await api[method](requestUrl);
      }
    }
    log(`Set "${key}" in cache.`);
    redis.set(cacheKey, JSON.stringify({ data: response.data }), 'EX', maxAge);

    return response;
  }
}
