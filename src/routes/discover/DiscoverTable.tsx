import { Box, Stat, StatArrow, StatNumber, Flex } from '@chakra-ui/core';
import React, { FC } from 'react';
import { Row } from 'react-table';
import { Hidden } from '../../common/components/Hidden';
import * as styles from './Discover.scss';
import { IStockWithPrice } from './DiscoverActions';
import ArbieTable from '../../common/components/ArbieTable';

type Props = {
    data: any;
    loading: boolean;
    totalCount: number;
    setInternalPageIndex: Function;
    setInternalPageSize: Function;
    internalPageSize: number;
    internalPageIndex: number;
}

const _columns = [
    {
        Header: 'Ticker',
        accessor: 'ticker',
    },
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Exchange',
        accessor: 'exchange',
    },
    {
        Header: 'Sector',
        accessor: 'sector',
    },
    {
        Header: 'Industry',
        accessor: 'industry',
    },
    {
        Header: 'Date',
        accessor: 'date',
    },
    {
        Header: 'Last Close',
        accessor: 'close',
    },
    {
        id: 'changePercent',
        Header: '% Change',
        accessor: (row: IStockWithPrice) => {
            let status = 'neutral';
            if (row.changePercent < 0) status = 'decrease';
            if (row.changePercent > 0) status = 'increase';
            return (
                <Stat>
                    <Flex alignItems='center'>
                        <Box width={8}>
                            <Hidden when={status === 'neutral'}>
                                <StatArrow type={row.changePercent < 0 ? 'decrease' : 'increase' }/>
                            </Hidden>
                        </Box>
                        <StatNumber fontSize='14'>{row.changePercent || '-'}</StatNumber>
                    </Flex>
                </Stat>
            )
        },
        sortType: (rowA: Row, rowB: Row) => {
            if ((rowA.original as IStockWithPrice).changePercent < (rowB.original as IStockWithPrice).changePercent) return 1;
            return -1;
        }
    },
    {
        Header: 'Volume',
        accessor: 'volume',
    },
]

const DiscoverTable: FC<Props> = ({
    data = [],
    loading,
    totalCount,
    setInternalPageIndex,
    setInternalPageSize,
    internalPageSize,
    internalPageIndex,
}: Props) => {
    const columns = React.useMemo(() => _columns, []);

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

export default DiscoverTable;