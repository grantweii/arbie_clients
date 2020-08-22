import React, { FC, useContext } from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/line';
import { Spinner, Heading, Stack, Box, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Alert, AlertIcon } from "@chakra-ui/core";
import Select from 'react-select';
import * as styles from './Fundamentals.scss';
import { StockContext } from '../core/Stock';
import { IStock, Exchange } from '../../utils/types';
import useFundamentalsViewModel from './FundamentalsViewModel';

const option = (dates: string[], values: number[], graphType: string, title: string, lineColor?: string) => {
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
            type: 'line',
            lineStyle: { color: lineColor }
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

const Fundamentals: FC<any> = ({ children }) => {
    const [
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
    ] = useFundamentalsViewModel();
    const stock: IStock = useContext(StockContext);
    

    if (!financialData?.length || !cashflowData?.length || !yearsToFilter) return <Spinner />

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
                        isOptionDisabled={(option) => option.value === 'quarterly' && stock.exchange === Exchange.ASX}
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
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    {periodFilterError &&
                        <Alert status='error' width='200px'>
                            <AlertIcon />
                            {periodFilterError}
                        </Alert>
                    }
                </Box>
            </Stack>
            <div className={styles.grid}>
                <ReactEchartsCore
                    echarts={echarts}
                    option={option(netIncomeDates, netIncomeValues, graphType, 'Net Income') as any}
                    notMerge={true}
                    lazyUpdate={true}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option(dilutedEPSDates, dilutedEPSValues, graphType, 'EPS', 'blue') as any}
                    notMerge={true}
                    lazyUpdate={true}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option(revenueDates, revenueValues, graphType, 'Total Revenue', 'green') as any}
                    notMerge={true}
                    lazyUpdate={true}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option(dilutedAvgSharesDates, dilutedAvgSharesValues, 'linear', 'Diluted Average Shares', 'purple') as any}
                    notMerge={true}
                    lazyUpdate={true}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option(freeCashFlowDates, freeCashFlowValues, 'linear', 'Free Cash Flow', 'orange') as any}
                    notMerge={true}
                    lazyUpdate={true}
                />
            </div>
            {children}
        </React.Fragment>
    )
}

export default Fundamentals;