import React, { FC } from 'react';
import { useRouteNode } from 'react-router5';
import Select from 'react-select';
import useDiscoverViewModel from './DiscoverViewModel';
import * as styles from './Discover.scss';
import { Stack, Heading, Flex, Box } from '@chakra-ui/core';
import Button from '../../common/components/Button';
import DiscoverTable from './DiscoverTable';
import { Hidden } from '../../common/components/Hidden';
import { IStockWithPrice } from './DiscoverActions';

const makeData = (stocks: IStockWithPrice[]) => {
    return stocks?.map(stock => {
        return {
            ticker: stock.ticker,
            name: stock.name,
            sector: stock.sector,
            industry: stock.industry,
            exchange: stock.exchange,
            close: stock.close,
            changePercent: stock.changePercent,
            volume: stock.volume,
            date: stock.date,
        }
    });
}


const Discover: FC<any> = ({ children }) => {
    const { route } = useRouteNode('root.discover');
    const {
        filteredIndustry,
        filteredSector,
        filteredExchange,
        industryOptions,
        sectorOptions,
        exchangeOptions,
        loadingList,
        pageSize,
        pageIndex,
        setFilteredIndustry,
        setFilteredSector,
        setFilteredExchange,
        setPageIndex,
        setPageSize,
        stockList,
    } = useDiscoverViewModel();

    const data = React.useMemo(() => makeData(stockList?.results), [stockList?.results?.[0]]);
    return (
        <React.Fragment>
            <Heading as='h3' size='lg' marginBottom={4}>Filters</Heading>
            <Stack spacing={8} isInline>
                <Stack spacing={2}>
                    <Heading as='h5' size="sm">Exchange</Heading>
                    <Select
                        value={filteredExchange && { value: filteredExchange, label: filteredExchange }}
                        onChange={(selected: any) => {
                            setFilteredExchange(selected?.value);
                            setPageIndex(0);
                        }}
                        options={exchangeOptions}
                        placeholder='Exchange'
                        className={styles.select}
                        isClearable
                    />
                </Stack>
                <Stack spacing={2}>
                    <Heading as='h5' size="sm">Industry</Heading>
                    <Select
                        value={filteredIndustry && { value: filteredIndustry, label: filteredIndustry }}
                        onChange={(selected: any) => {
                            setFilteredIndustry(selected?.value);
                            setPageIndex(0);
                        }}
                        options={industryOptions}
                        placeholder='Industry'
                        className={styles.select}
                        isClearable
                    />
                </Stack>
                <Stack spacing={2}>
                    <Heading as='h5' size="sm">Sector</Heading>
                    <Select
                        value={filteredSector && { value: filteredSector, label: filteredSector }}
                        onChange={(selected: any) => {
                            setFilteredSector(selected?.value);
                            setPageIndex(0);
                        }}
                        options={sectorOptions}
                        placeholder='Sector'
                        className={styles.select}
                        isClearable
                    />
                </Stack>
            </Stack>
            <Hidden when={!stockList?.results?.length}>
                <Box marginTop={8}>
                    <Stack spacing={4}>
                        <Heading as='h4' size='md'>Total Results: {stockList?.count}</Heading>
                        <DiscoverTable
                            data={data}
                            loading={loadingList}
                            totalCount={stockList?.count}
                            internalPageSize={pageSize}
                            internalPageIndex={pageIndex}
                            setInternalPageIndex={setPageIndex}
                            setInternalPageSize={setPageSize}/>
                    </Stack>
                </Box>
            </Hidden>
        </React.Fragment>
    )
}

export default Discover;