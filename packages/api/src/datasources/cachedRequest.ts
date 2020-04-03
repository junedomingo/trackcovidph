import { redis } from '../config';
import { log, parseToJSON, getDummyData } from '../utils';

export async function cachedRequest(
  api: any,
  method: string = 'get',
  resourceUrl: string,
  maxAge: number,
  isDummy: boolean = false
): Promise<{ data: string }> {
  method = method.toLowerCase();
  const requestUrl = `${api.baseURL}${resourceUrl}`;
  const httpCacheId = `httpcache:${requestUrl}`;
  const dummyCacheId = `dummycache:${resourceUrl}`;
  const cachedResponse = await redis.get(isDummy ? dummyCacheId : httpCacheId);
  const cacheId = isDummy ? dummyCacheId : httpCacheId;

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

    if (maxAge > 0) {
      log('Set response in cache.');
      redis.set(cacheId, JSON.stringify({ data: response.data }), {
        ttl: maxAge,
      });
    }

    return response;
  }
}
