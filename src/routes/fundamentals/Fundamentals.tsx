import React, { FC, useState } from 'react';
import { useRouteNode, useRouter, useRoute } from 'react-router5';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/line';
import { getAnnualFinancial, IFundamental, getInstitutionalHolders, getMajorHolders, getQuarterlyFinancial, getAnnualCashflow, getQuarterlyCashflow, ICashflow } from '../dashboard/DashboardActions';
import { useQuery } from 'react-query';
import { Spinner, Heading, SimpleGrid, Stack, Box, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Alert, AlertIcon } from "@chakra-ui/core";
import Select from 'react-select';
import * as styles from './Fundamentals.scss';
import moment from 'moment';
import { useDebouncedCallback } from 'use-debounce';

const option = (dates: string[], values: number[], graphType: string, title: string) => {
    const yAxisType = graphType === 'log' ? 'log' : 'value';
    return {
        title: {
            text: title,
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: dates,
        },
        yAxis: {
            type: yAxisType,
        },
        series: [{
            data: values,
            type: 'line'
        }],
        grid: {
            containLabel: true,
        }
    }
};

const graphTypeOptions = [
    { value: 'log', label: 'log' },
    { value: 'linear', label: 'linear' },
];

const graphPeriodOptions = [
    { value: 'annual', label: 'annual' },
    { value: 'quarterly', label: 'quarterly' },
]

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

const Fundamentals: FC<any> = ({ children }) => {
    const { route } = useRouteNode('stock.id.fundamentals');
    const { params } = route;
    // const { data: institutionalHolders } = useQuery(['institutionalHolders', { stock_id: params.id }], getInstitutionalHolders, { staleTime: 60 * 1000 * 10 });
    // const { data: majorHolders } = useQuery(['majorHolders', { stock_id: params.id }], getMajorHolders, { staleTime: 60 * 1000 * 10 });
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
    
    if (!financialData?.length || !cashflowData?.length || !yearsToFilter) return <Spinner/>

    return (
        <React.Fragment>
                <Stack spacing={8} isInline mb='4'>
                    <Box>
                        <Heading as='h5' size="sm">Graph Type</Heading>
                        <Select 
                            value={{ label: graphType, value: graphType }}
                            onChange={(selected: any) => setGraphType(selected.value)}
                            options={graphTypeOptions}
                            className={styles.graphTypeSelect}
                        />
                    </Box>
                    <Box>
                        <Heading as='h5' size="sm">Graph Period</Heading>
                        <Select
                            value={{ label: graphPeriod, value: graphPeriod }}
                            onChange={(selected: any) => setGraphPeriod(selected.value)}
                            options={graphPeriodOptions}
                            className={styles.graphTypeSelect}
                        />
                    </Box>
                    <Box>
                    <Heading as='h5' size='sm'>Years To Show</Heading>
                    <NumberInput
                        defaultValue={yearsToFilter}
                        min={3} max={yearsToFilter}
                        size='md'
                        width={200}
                        onChange={debouncedCallback}
                        className={styles.graphTypeSelect}
                        my='2'>
                        <NumberInputField/>
                        <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                        </NumberInputStepper>
                    </NumberInput>
                    {periodFilterError && 
                        <Alert status='error' width='200px'>
                            <AlertIcon/>
                            {periodFilterError}
                        </Alert>
                    }
                </Box>
            </Stack>
            <div className={styles.grid}>
                <ReactEchartsCore
                    echarts={echarts}
                    option={option(netIncomeDates, netIncomeValues, graphType, 'Net Income')}
                    notMerge={true}
                    lazyUpdate={true}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option(dilutedEPSDates, dilutedEPSValues, graphType, 'EPS')}
                    notMerge={true}
                    lazyUpdate={true}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option(revenueDates, revenueValues, graphType, 'Total Revenue')}
                    notMerge={true}
                    lazyUpdate={true}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option(dilutedAvgSharesDates, dilutedAvgSharesValues, 'linear', 'Diluted Average Shares')}
                    notMerge={true}
                    lazyUpdate={true}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option(freeCashFlowDates, freeCashFlowValues, 'linear', 'Free Cash Flow')}
                    notMerge={true}
                    lazyUpdate={true}
                />
            </div>

            {children}
        </React.Fragment>
    )
}

export default Fundamentals;