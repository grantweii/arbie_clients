import { get, post } from '../../common/utils/utils';

export const runBacktest = async (body: any) => {
    console.log('b9ody', body);
    const response = await post(`/backtest/run`, body);
    return response.result;
}

export const getAllBacktests = async (key: any) => {
    const response = await get(`/backtest/all`);
    return response.result;
}