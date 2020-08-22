import { getAnnualFinancial, getQuarterlyFinancial, getAnnualCashflow, getQuarterlyCashflow } from "../dashboard/DashboardActions";
import moment from 'moment';
import { useRouteNode } from "react-router5";
import { useQuery } from "react-query";
import { useState, useContext } from "react";
import { useDebouncedCallback } from "use-debounce/lib";
import { StockContext } from "../core/Stock";
import { IFundamental } from "../../utils/types";


const sortEntries = (entries: IFundamental[]) => {
    return entries?.sort((a: IFundamental, b: IFundamental) => {
        const date1 = new Date(a.date);
        const date2 = new Date(b.date);
        if (date1 < date2) return -1;
        return 1;
    });
}

const filterFundamentals = (data: IFundamental[], entry: string, graphType: string, yearsToFilter: number) => {
    const startDate = moment().subtract(yearsToFilter, 'years');
    const filteredEntries = data?.filter((af: IFundamental) => af.entry === entry && moment(af.date).diff(startDate, 'years') >= 0);
    const sortedEntries = sortEntries(filteredEntries);
    const dates = sortedEntries?.map((af: IFundamental) => af.date);
    const values = sortedEntries?.map((af: IFundamental) => {
        if (parseFloat(af.value) <= 0  && graphType === 'log') return null;
        return parseFloat(af.value);
    });
    return { dates, values };
}

const getYearsSinceListing = (data: IFundamental[]) => {
    if (!data?.length) return null;
    const sortedEntries = sortEntries(data);
    const startDate = sortedEntries[0].date;
    const year = moment(startDate);
    const yearsBetween = moment().diff(year, 'years');
    return yearsBetween;
}

export type ViewModelProps = [
    {
        dilutedEPSDates: string[],
        dilutedEPSValues: number[],
        netIncomeDates: string[],
        netIncomeValues: number[],
        revenueDates: string[],
        revenueValues: number[],
        dilutedAvgSharesDates: string[],
        dilutedAvgSharesValues: number[],
        freeCashFlowDates: string[],
        freeCashFlowValues: number[],
        financialData: IFundamental[],
        cashflowData: IFundamental[],
        graphType: string,
        graphPeriod: string,
        periodFilterError: string,
        yearsToFilter: number,
    },
    (value: any) => void,
    (periodToSet: string) => void,
    (graphTypeToSet: string) => void, 
]
    
export function useFundamentalsViewModel(): ViewModelProps {
    
    const { route } = useRouteNode('stock.id.fundamentals');
    const { params } = route;

    const [graphType, setGraphType] = useState('log'); // default to log graph
    const [graphPeriod, setGraphPeriod] = useState('annual');
    const [maxYearsToFilter, setMaxYearsToFilter] = useState(null);
    const [yearsToFilter, setYearsToFilter] = useState(null);
    const [periodFilterError, setPeriodFilterError] = useState(null);
    const [debouncedCallback] = useDebouncedCallback((value) => {
        if (value > maxYearsToFilter) {
            setPeriodFilterError(`Period must be max ${maxYearsToFilter}`);
            return;
        }
        if (value < 3) {
            setPeriodFilterError(`Period must be min 3`);
            return;
        }
        setPeriodFilterError(null);
        setYearsToFilter(value);
    }, 1000);

    const handleDataRetrieved = (data: any) => {
        if (maxYearsToFilter) return;
        const yearsSinceListing= getYearsSinceListing(data);
        setMaxYearsToFilter(yearsSinceListing);
        setYearsToFilter(yearsSinceListing);
    }

    const { data: annualFinancials } = useQuery(
        ['annualFinancials', { stock_id: params.id }],
        getAnnualFinancial,
        { staleTime: 60 * 1000 * 10, enabled: graphPeriod === 'annual', onSuccess: handleDataRetrieved }
    );
    const { data: quarterlyFinancials } = useQuery(
        ['quarterlyFinancials', { stock_id: params.id }],
        getQuarterlyFinancial,
        { staleTime: 60 * 1000 * 10, enabled: graphPeriod === 'quarterly', onSuccess: handleDataRetrieved }
    );

    const { data: annualCashflows } = useQuery(
        ['annualCashflows', { stock_id: params.id }],
        getAnnualCashflow,
        { staleTime: 60 * 1000 * 10, enabled: graphPeriod === 'annual', onSuccess: handleDataRetrieved }
    );

    const { data: quarterlyCashflows } = useQuery(
        ['quarterlyCashflows', { stock_id: params.id }],
        getQuarterlyCashflow,
        { staleTime: 60 * 1000 * 10, enabled: graphPeriod === 'quarterly', onSuccess: handleDataRetrieved }
    );

    const financialData = graphPeriod === 'annual' ? annualFinancials : quarterlyFinancials;
    const cashflowData = graphPeriod === 'annual' ? annualCashflows : quarterlyCashflows;

    const { dates: dilutedEPSDates, values: dilutedEPSValues } = filterFundamentals(financialData, 'diluted_eps', graphType, yearsToFilter);
    const { dates: netIncomeDates, values: netIncomeValues } = filterFundamentals(financialData, 'net_income', graphType, yearsToFilter);
    const { dates: revenueDates, values: revenueValues } = filterFundamentals(financialData, 'total_revenue', graphType, yearsToFilter);
    const { dates: dilutedAvgSharesDates, values: dilutedAvgSharesValues } = filterFundamentals(financialData, 'diluted_average_shares', 'linear', yearsToFilter);
    const { dates: freeCashFlowDates, values: freeCashFlowValues } = filterFundamentals(cashflowData, 'free_cash_flow', 'linear', yearsToFilter);
    
    return [
        {
            dilutedEPSDates,
            dilutedEPSValues,
            netIncomeDates,
            netIncomeValues,
            revenueDates,
            revenueValues,
            dilutedAvgSharesDates,
            dilutedAvgSharesValues,
            freeCashFlowDates,
            freeCashFlowValues,
            financialData,
            cashflowData,
            graphType,
            graphPeriod,
            periodFilterError,
            yearsToFilter,
        },
        debouncedCallback,
        setGraphPeriod,
        setGraphType
    ]
}

export default useFundamentalsViewModel;