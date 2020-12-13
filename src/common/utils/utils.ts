import bent, { NodeResponse } from 'bent';
import environment from '../../../arbie.environment';

type QueryStatus = 'loading' | 'error' | 'success' | 'idle';

type Response = { result: any, error: string, success: boolean }

export const isQueryLoading = (status: QueryStatus) => {
    return status === 'loading';
}

export const hasQueryErrored = (status: QueryStatus) => {
    return status === 'error';
}

export const hasQuerySucceeded = (status: QueryStatus) => {
    return status === 'success';
}

export const mergeClasses = (...classNames: any) => {
    return classNames.join(' ');
}

/**
 * Remove params that are undefined or null
 * Since BE is in python, it does not recognise these values
 * Simply dont provide the param
 * Currently does not support objects or array as param values
 */
const cleanParams= (url: string) => {
    const destructuredUrl = url.split('?');
    let endpoint = destructuredUrl[0];
    let params = '';
    if (destructuredUrl.length > 1) {
        const destructuredParams = destructuredUrl[1].split('&');
        for (const param of destructuredParams) {
            // currently only supports singular values
            // if values is an array, this wont clean it
            // implement if required
            const [key, value] = param.split('=')
            if (value !== 'undefined' && value !== 'null') {
                params += `${key}=${value}&`
            }
        }
        // get rid of any trailing '&'
        if (params.slice(-1) === '&') {
            params = params.slice(0, -1)
        }
    }
    if (params) endpoint += `?${params}`;
    return endpoint;
}

export const get = async (url: string) => {
    const cleanEndpoint = cleanParams(url);
    return (bent(`http://${environment.SERVER_HOST}:5000`, 'GET', 'json', 200) as any)(cleanEndpoint);
}

export const post = (url: string, body: any) => {
    return (bent(`http://${environment.SERVER_HOST}:5000`, 'POST', 'json', 200) as any)(url, body);
}