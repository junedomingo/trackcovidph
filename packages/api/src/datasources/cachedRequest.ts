import { redis } from '../config';
import { log, parseToJSON, getDummyData } from '../utils';

export async function cachedRequest(
  api: any,
  resourceUrl: string,
  isDummy: boolean = false,
  maxAge: number = 60 * 10,
  method: string = 'get'
): Promise<{ data: string }> {
  const requestUrl = `${api.baseURL}${resourceUrl}`;
  const httpCacheKey = `httpcache:${requestUrl}`;
  const dummyCacheKey = `dummycache:${resourceUrl}`;
  const cachedResponse = await redis.get(isDummy ? dummyCacheKey : httpCacheKey);
  const cacheKey = isDummy ? dummyCacheKey : httpCacheKey;

  if (cachedResponse) {
    log('Fetching data from cache.');
    const parsedCacheResponse = parseToJSON(cachedResponse);
    return parsedCacheResponse;
  } else {
    let response = { data: '' };

    if (isDummy) {
      response.data = getDummyData(`${__dirname}/${resourceUrl}`);
    } else {
      //@ts-ignore
      response.data = await api[method](requestUrl);
    }

    log('Set response in cache.');
    redis.set(cacheKey, JSON.stringify({ data: response.data }), {
      ttl: maxAge,
    });

    return response;
  }
}
