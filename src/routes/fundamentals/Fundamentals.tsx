import React, { FC, useState } from 'react';
import { useRouteNode, useRouter, useRoute } from 'react-router5';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/line';
import { getAnnualFinancial, IAnnualFinancial, getHolders } from '../dashboard/DashboardActions';
import { useQuery } from 'react-query';
import { Spinner, Heading } from "@chakra-ui/core";
import Select from 'react-select';
import * as styles from './Fundamentals.scss';


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

const graphOptions = [
    { value: 'log', label: 'log' },
    { value: 'linear', label: 'linear' },
];

const sortEntries = (entries: IAnnualFinancial[]) => {
    return entries?.sort((a: IAnnualFinancial, b: IAnnualFinancial) => {
        const date1 = new Date(a.date);
        const date2 = new Date(b.date);
        if (date1 < date2) return -1;
        return 1;
    });
}

const filterFundamentals = (annualFinancials: IAnnualFinancial[], entry: string, graphType: string) => {
    const filteredEntries = annualFinancials?.filter((af: IAnnualFinancial) => af.entry === entry);
    const sortedEntries = sortEntries(filteredEntries);
    const dates = sortedEntries?.map((af: IAnnualFinancial) => af.date);
    const values = sortedEntries?.map((af: IAnnualFinancial) => {
        if (parseFloat(af.value) <= 0  && graphType === 'log') return null;
        return parseFloat(af.value);
    });
    return { dates, values };
}

const Fundamentals: FC<any> = ({ children }) => {
    const { route } = useRouteNode('stock.id.fundamentals');
    const { params } = route;
    const { data: annualFinancials } = useQuery(['annualFinancials', { stock_id: params.id }], getAnnualFinancial, { staleTime: 60 * 1000 * 10 });
    const { data: holders } = useQuery(['holders', { stock_id: params.id }], getHolders, { staleTime: 60 * 1000 * 10 });
    const [graphType, setGraphType] = useState('log'); // default to log graph

    const { dates: dilutedEPSDates, values: dilutedEPSValues } = filterFundamentals(annualFinancials, 'diluted_eps', graphType);
    const { dates: netIncomeDates, values: netIncomeValues } = filterFundamentals(annualFinancials, 'net_income', graphType);
    const { dates: revenueDates, values: revenueValues } = filterFundamentals(annualFinancials, 'total_revenue', graphType);
    const { dates: ebitdaDates, values: ebitdaValues } = filterFundamentals(annualFinancials, 'normalized_ebitda', graphType);
    const { dates: dilutedAvgSharesDates, values: dilutedAvgSharesValues } = filterFundamentals(annualFinancials, 'diluted_average_shares', 'linear');

    if (!annualFinancials?.length) return <Spinner/>

    return (
        <React.Fragment>
            <Heading as='h5' size="sm">Graph Type</Heading>
            <Select 
                value={{ label: graphType, value: graphType }}
                onChange={(selected: any) => setGraphType(selected.value)}
                options={graphOptions}
                className={styles.graphTypeSelect}
            />
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
                    option={option(ebitdaDates, ebitdaValues, graphType, 'Normalized EBITDA')}
                    notMerge={true}
                    lazyUpdate={true}
                />
                <ReactEchartsCore
                    echarts={echarts}
                    option={option(dilutedAvgSharesDates, dilutedAvgSharesValues, 'linear', 'Diluted Average Shares')}
                    notMerge={true}
                    lazyUpdate={true}
                />
            </div>

            {children}
        </React.Fragment>
    )
}

export default Fundamentals;