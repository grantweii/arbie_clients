import { get, post } from '../../common/utils/utils';

export const runBacktest = async (key: any) => {
    const response = await post(`/backtest/run`);
    return response.result;
}
