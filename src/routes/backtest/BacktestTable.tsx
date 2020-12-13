import React, { FC } from 'react';
import * as styles from './Backtest.scss';
import Button from '../../common/components/Button';
import ArbieTable from '../../common/components/ArbieTable';

type Props = {
    data: any;
    loading: boolean;
    totalCount: number;
    setInternalPageIndex: Function;
    setInternalPageSize: Function;
    internalPageSize: number;
    internalPageIndex: number;
    runBacktest: any;
    isRunning: boolean;
}

const pageCountOptions = [
    { label: 'Show 10', value: 10 },
    { label: 'Show 25', value: 25 },
    { label: 'Show 50', value: 50 },
    { label: 'Show 100', value: 100 },
];

const _columns = (runBacktest: any, isRunning: boolean) => [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Description',
        accessor: 'description',
    },
    {
        id: 'action',
        Header: 'Action',
        accessor: (row: any) => {
            console.log('row', row);
            return (
                <Button onClick={() => runBacktest({ script: row.name })} loading={isRunning}>
                    Run
                </Button>
            )
        },
    },
]

const BacktestTable: FC<Props> = ({
    data = [],
    loading,
    totalCount,
    setInternalPageIndex,
    setInternalPageSize,
    internalPageSize,
    internalPageIndex,
    runBacktest,
    isRunning,
}: Props) => {
    const columns = React.useMemo(() => _columns(runBacktest, isRunning), []);

    return (
        <ArbieTable
            data={data}
            loading={loading}
            totalCount={totalCount}
            internalPageSize={internalPageSize}
            internalPageIndex={internalPageIndex}
            setInternalPageIndex={setInternalPageIndex}
            setInternalPageSize={setInternalPageSize}
            columns={columns}
            styles={styles}
        />
    )
}

export default BacktestTable;