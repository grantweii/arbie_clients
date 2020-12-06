
import React, { FC } from 'react';
import { useMutation } from 'react-query';
import { useRouteNode } from 'react-router5';
import Button from '../../common/components/Button';
import { runBacktest } from './BacktestActions';

const Backtest: FC<any> = ({ children }) => {
    const { route } = useRouteNode('root.backtest');
    const [run, { isLoading: isRunning, data }] = useMutation(runBacktest);

    return (
        <>
            <Button onClick={run}>Run</Button>
        </> 
    )
}

export default Backtest;