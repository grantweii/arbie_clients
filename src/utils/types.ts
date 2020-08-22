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

export enum Exchange {
    ASX = 'ASX',
    NYSE = 'NYSE',
    NASDAQ = 'NASDAQ',
}