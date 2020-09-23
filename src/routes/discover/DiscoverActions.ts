import { IStock } from '../../common/utils/types';
import { get } from '../../common/utils/utils';

export type GetStockListResponse = {
    results: IStockWithPrice[];
    count: number;
}

export type IStockWithPrice = {
    close?: number;
    date?: string;
    volume?: number;
    changePercent?: number;
} & IStock

export const getIndustries = async (key: string, args: any) => {
    const response = await get(`/stocks/industries?sector=${args.sector}`);
    return response.result;
}

export const getSectors = async (key: string, args: any) => {
    const response = await get(`/stocks/sectors?industry=${args.industry}`);
    return response.result;
}

export const getExchanges = async (key: string) => {
    const response = await get(`/stocks/exchanges`);
    return response.result;
}

export const getStockList = async (key: string, args: any): Promise<GetStockListResponse> => {
    const response = await get(`/stocks/list?sector=${args.sector}&industry=${args.industry}&exchange=${args.exchange}&pageSize=${args.pageSize}&pageIndex=${args.pageIndex}`);
    return response.result;
}
