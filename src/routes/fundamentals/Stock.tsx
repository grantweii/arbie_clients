import React, { FC } from 'react';
import { useRouteNode } from 'react-router5';
import { useQuery } from 'react-query';
import { getStock, getStockPrice } from '../search/SearchActions';
import { Heading, Divider, Tab, TabList, Tabs, TabPanels, TabPanel, Spinner } from "@chakra-ui/core";
import Fundamentals from './Fundamentals';
import { isQueryLoading } from '../../common/utils/utils';

export const StockContext = React.createContext(null);

const Stock: FC<any> = ({ children }) => {
    const { route } = useRouteNode('root.stock.id');
    const { params } = route;
    const { data: stock, isLoading } = useQuery(['stock', { id: params.id }], getStock, { staleTime: 60 * 1000 * 10 });

    const { data: stockPrice } = useQuery(['stockPrice', { id: params.id }], getStockPrice, { staleTime: 60 * 1000 * 10 });

    if (isLoading) return <Spinner/> 

    return (
        <StockContext.Provider value={stock}>
            <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                <Divider/>
                <Heading>{stock?.name}</Heading>
                <Heading as="h5" size="sm">{stock?.ticker}, {stock?.exchange}</Heading>
                <Heading as='h5' size='sm'>{stock?.sector}, {stock?.industry}</Heading>
            </div>
            {children}
        </StockContext.Provider>
    )
}

export default Stock;