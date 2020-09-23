import { get } from '../../common/utils/utils';

export const getAnnualFinancial = async (key: any, { stock_id, fields }: any) => {
    const response = await get(`/annual-financials?stock_id=${stock_id}&fields=${fields}`);
    return response.result;
}

export const getQuarterlyFinancial = async (key: any, { stock_id, fields }: any) => {
    const response = await get(`/quarterly-financials?stock_id=${stock_id}&fields=${fields}`);
    return response.result;
}

export const getAnnualCashflow = async (key: any, { stock_id, fields }: any) => {
    const response = await get(`/annual-financials/cashflow?stock_id=${stock_id}&fields=${fields}`);
    return response.result;
}

export const getQuarterlyCashflow = async (key: any, { stock_id, fields }: any) => {
    const response = await get(`/quarterly-financials/cashflow?stock_id=${stock_id}&fields=${fields}`);
    return response.result;
}

