
import { Heading } from '@chakra-ui/core';
import React, { FC, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useRouteNode } from 'react-router5';
import Button from '../../common/components/Button';
import { runBacktest, getAllBacktests } from './BacktestActions';
import BacktestTable from './BacktestTable';

const Backtest = () => {
    const { route } = useRouteNode('root.backtest');
    const [pageSize, setPageSize] = useState(50);
    const [pageIndex, setPageIndex] = useState(0);
    const [run, { isLoading: isRunning, data }] = useMutation(runBacktest);
    const { data: backtests, isLoading: loadingBacktests } = useQuery(['allBacktests'], getAllBacktests, { staleTime: 60 * 1000 * 10 });
    console.log('data from backtest', data);
    console.log('all tests', backtests);


    return (
        <>
            <Heading as='h3' size='lg' marginBottom={4}>Backtester</Heading>
            <BacktestTable
                data={backtests}
                loading={loadingBacktests}
                totalCount={backtests?.length}
                internalPageSize={pageSize}
                internalPageIndex={pageIndex}
                setInternalPageIndex={setPageIndex}
                setInternalPageSize={setPageSize}
                runBacktest={run}
                isRunning={isRunning}
            />
        </>
    )
}

export default Backtest;





