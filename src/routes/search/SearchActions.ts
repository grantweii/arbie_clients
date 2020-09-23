import { get } from '../../common/utils/utils';

export const getStocks = async () => {
    const response = await get('/stocks');
    return response;
}

export const searchStocks = async (ticker: string) => {
    const response = await get(`/stocks/search?ticker=${ticker}`);
    return response.result;
}

export const getStock = async (key: any, { id }: any) => {
    const response = await get(`/stocks/${id}`);
    return response.result;
}

export const getInstitutionalHolders = async (key: any, { stock_id }: any) => {
    const response = await get(`/stocks/${stock_id}/institutional-holders`);
    return response.result;
}

export const getMajorHolders = async (key: any, { stock_id }: any) => {
    const response = await get(`/stocks/${stock_id}/major-holders`);
    return response.result;
}

export const getStockPrice = async (key: any, { id }: any) => {
    const response = await get(`/stocks/${id}/price`);
    return response.result;
}