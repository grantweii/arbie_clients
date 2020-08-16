import bent, { NodeResponse } from 'bent';

export const get = bent('http://127.0.0.1:5000', 'GET', 'json', 200) as any;
export const post = bent('http://127.0.0.1:5000', 'POST', 'json', 200) as any;

export interface IStock {
    id: string;
    ticker: string;
    exchange: string;
    name: string;
}

export interface IFundamental {
    date: string;
    entry: string;
    id: number;
    stock_id: number;
    value: string;
}

export const getStocks = async () => {
    const response = await get('/stocks');
    return response;
}

export const searchStocks = async (ticker: string) => {
    const response = await get(`/stocks/search?ticker=${ticker}`);
    return response.result;
}

export const getAnnualFinancial = async (key: any, { stock_id, fields }: any) => {
    const response = await get(`/annual-financials?stock_id=${stock_id}&fields=${fields}`);
    return response.result;
}

export const getQuarterlyFinancial = async (key: any, { stock_id, fields }: any) => {
    const response = await get(`/quarterly-financials?stock_id=${stock_id}&fields=${fields}`);
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
