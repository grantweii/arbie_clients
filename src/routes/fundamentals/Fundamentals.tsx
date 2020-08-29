import React, { FC, useContext } from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/markLine';
import {
    Switch,
    Spinner,
    Heading,
    Stack,
    Box,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Alert,
    AlertIcon,
    FormLabel
} from "@chakra-ui/core";
import Select from 'react-select';
import * as styles from './Fundamentals.scss';
import { StockContext } from '../core/Stock';
import { IStock, Exchange } from '../../utils/types';
import useFundamentalsViewModel from './FundamentalsViewModel';

type EchartsProps = {
    dates: string[],
    values: number[],
    graphType: string,
    title: string,
    lineColor?: string,
    ratesOfChangeValues?: any[];
    referencePercentage?: number;
    rateOfChangeVisible?: boolean;
}

const option = (props: EchartsProps) => {
    const { dates, values, graphType, title, lineColor, ratesOfChangeValues, referencePercentage, rateOfChangeVisible } = props;
    const yAxisType = graphType === 'log' ? 'log' : 'value';
    const options: any = {
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
            scale: true,
        },
        yAxis: [
            {
                type: yAxisType,
            },
        ],
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                start: 0,
                end: 100
            }
        ],
        series: [
            {
                data: values,
                type: 'line',
                lineStyle: { color: lineColor },
            },
        ],
        grid: {
            containLabel: true,
        },
    };
    if (rateOfChangeVisible && ratesOfChangeValues) {
        options.series.push({
            data: ratesOfChangeValues,
            type: 'bar',
            yAxisIndex: 1,
            markLine: {
                data: [
                    {
                        yAxis: referencePercentage,
                    }
                ],
            }
        });
        options.yAxis.push({
            name: '%',
            type: 'value'
        });
    }
    return options;
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
            dilutedEPSRatesOfChange,
            netIncomeDates,
            netIncomeValues,
            netIncomeRatesOfChange,
            revenueDates,
            revenueValues,
            revenueRatesOfChange,
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
            referencePercentage,
            rateOfChangeVisible,
        },
        debouncedCallback,
        setGraphPeriod,
        setGraphType,
        referenceLineDebounce,
        setRateOfChangeVisibility,
    ] = useFundamentalsViewModel();
    const stock: IStock = useContext(StockContext);

    if (!financialData?.length || !cashflowData?.length || !yearsToFilter) return <Spinner />

    return (
        <React.Fragment>
            <Stack spacing={8} isInline mb='4'>
                <Stack spacing={2}>
                    <Heading as='h5' size="sm">Graph type</Heading>
                    <Select
                        value={{ label: graphType, value: graphType }}
                        onChange={(selected: any) => setGraphType(selected.value)}
                        options={graphTypeOptions}
                        className={styles.graphTypeSelect}
                    />
                </Stack>
                <Stack spacing={2}>
                    <Heading as='h5' size="sm">Graph period</Heading>
                    <Select
                        value={{ label: graphPeriod, value: graphPeriod }}
                        onChange={(selected: any) => setGraphPeriod(selected.value)}
                        options={graphPeriodOptions}
                        isOptionDisabled={(option) => option.value === 'quarterly' && stock.exchange === Exchange.ASX}
                        className={styles.graphTypeSelect}
                    />
                </Stack>
                <Stack spacing={2}>
                    <Heading as='h5' size='sm'>Years to show</Heading>
                    <NumberInput
                        defaultValue={yearsToFilter}
                        min={3} max={yearsToFilter}
                        size='md'
                        width={200}
                        onChange={debouncedCallback}
                        className={styles.graphTypeSelect}
                    >
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
                </Stack>
                <Stack spacing={2}>
                    <Heading as='h5' size='sm'>Reference line</Heading>
                    <NumberInput
                        defaultValue={referencePercentage}
                        size='md'
                        width={200}
                        onChange={referenceLineDebounce}
                        className={styles.graphTypeSelect}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </Stack>
                <Stack spacing={3}>
                    <Heading as='h5' size='sm'>Show rate of change</Heading>
                    <Switch size='lg' id='switch' defaultIsChecked={rateOfChangeVisible} onChange={e => setRateOfChangeVisibility(e.target.checked)}></Switch>
                </Stack>
            </Stack>
            <div className={styles.grid}>
                <ReactEchartsCore
                    echarts={echarts}
                    option={option({
                        dates: netIncomeDates,
                        values: netIncomeValues,
                        graphType,
                        title: 'Net Income',
                        lineColor: 'red',
                        ratesOfChangeValues: netIncomeRatesOfChange,
                        referencePercentage,
                        rateOfChangeVisible
                    }) as any}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{ height: '400px' }}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option({
                        dates: dilutedEPSDates,
                        values: dilutedEPSValues,
                        graphType,
                        title: 'EPS',
                        lineColor: 'blue',
                        ratesOfChangeValues: dilutedEPSRatesOfChange,
                        referencePercentage,
                        rateOfChangeVisible
                    }) as any}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{ height: '400px' }}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option({
                        dates: revenueDates,
                        values: revenueValues,
                        graphType,
                        title: 'Total Revenue',
                        lineColor: 'gray',
                        ratesOfChangeValues: revenueRatesOfChange,
                        referencePercentage,
                        rateOfChangeVisible
                    }) as any}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{ height: '400px' }}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option({
                        dates: freeCashFlowDates,
                        values: freeCashFlowValues,
                        graphType: 'linear',
                        title: 'Free Cash Flow',
                        lineColor: 'orange',
                    }) as any}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{ height: '400px' }}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option({
                        dates: dilutedAvgSharesDates,
                        values: dilutedAvgSharesValues,
                        graphType: 'linear',
                        title: 'Diluted Average Shares',
                        lineColor: 'purple',
                    }) as any}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{ height: '400px' }}
                />
            </div>
            {children}
        </React.Fragment>
    )
}

export default Fundamentals;