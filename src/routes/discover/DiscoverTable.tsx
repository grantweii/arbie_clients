import { Box, Stat, StatArrow, StatHelpText, StatNumber, Flex, IconButton, Stack, Input, Text, Spinner } from '@chakra-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { useTable, useSortBy, ColumnInstance, Row, usePagination } from 'react-table';
import { Hidden } from '../../common/components/Hidden';
import * as styles from './Discover.scss';
import { IStockWithPrice } from './DiscoverActions';
import { useDebouncedCallback } from 'use-debounce/lib';
import GreaterThan from '../../common/assets/greater_than.svg';
import LessThan from '../../common/assets/less_than.svg';
import Select from 'react-select';

type Props = {
    data: any;
    loading: boolean;
    totalCount: number;
    setInternalPageIndex: Function;
    setInternalPageSize: Function;
    internalPageSize: number;
    internalPageIndex: number;
}

const pageCountOptions = [
    { label: 'Show 10', value: 10 },
    { label: 'Show 25', value: 25 },
    { label: 'Show 50', value: 50 },
    { label: 'Show 100', value: 100 },
];

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

const DiscoverTable: FC<Props> = ({ data = [], loading, totalCount, setInternalPageIndex, setInternalPageSize, internalPageSize, internalPageIndex }: Props) => {
    const columns = React.useMemo(() => _columns, []);
    // this state is only used to calculate the pageCount

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: internalPageIndex, pageSize: internalPageSize },
        manualPagination: true,
        pageCount: Math.ceil(totalCount / internalPageSize),
    }, useSortBy, usePagination);
    const [_gotoPage] = useDebouncedCallback((value: number) => {
        gotoPage(value);
    }, 1000);

    // update the internal state, this will trigger a refetch
    useEffect(() => {
        setInternalPageSize(pageSize);
        setInternalPageIndex(pageIndex);
    }, [pageIndex, pageSize]);

    return (
        <Box className={styles.table}>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column: ColumnInstance<object>)  => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Flex marginTop={4} className={styles.pagination} justifyContent='space-between' alignItems='center'>
                <Stack isInline spacing={4}>
                    <IconButton
                        aria-label='Previous Page'
                        onClick={previousPage}
                        isDisabled={!canPreviousPage}
                        icon={LessThan}
                        size='sm'
                    />
                    <IconButton
                        aria-label='Next Page'
                        onClick={nextPage}
                        isDisabled={!canNextPage}
                        icon={GreaterThan}
                        size='sm'
                    />
                </Stack>
                <Stack isInline spacing={4} alignItems='center'>
                    <Text fontSize='md'>Go to page:</Text>
                    <Input
                        size='sm'
                        type='number'
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            _gotoPage(page)
                        }}
                        style={{ width: '50px', padding: '0 8px' }}
                    />
                </Stack>
                <Box as='text' marginRight={4}>
                    {'Page '}
                    <b>{pageIndex + 1} of {pageOptions.length}</b>
                </Box>
                <Box>
                    <Select
                        value={pageCountOptions.find(o => o.value === pageSize)}
                        onChange={(selected: any) => setPageSize(selected.value)}
                        options={pageCountOptions}
                        className={styles.pageCountSelect}
                    />
                </Box>
            </Flex>
        </Box>
    )
}

export default DiscoverTable;