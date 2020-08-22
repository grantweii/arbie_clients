import React, { FC } from 'react';
import { useRouteNode } from 'react-router5';
import { useQuery } from 'react-query';
import { getStock } from '../dashboard/DashboardActions';
import { Heading, Divider, Tab, TabList, Tabs, TabPanels, TabPanel, Spinner } from "@chakra-ui/core";
import Fundamentals from '../fundamentals/Fundamentals';
import { isQueryLoading } from '../../utils/utils';

export const StockContext = React.createContext(null);

const Stock: FC<any> = ({ children }) => {
    const { route } = useRouteNode('stock.id');
    const { params } = route;
    const { data: stock, isLoading } = useQuery(['stocks', { id: params.id }], getStock, { staleTime: 60 * 1000 * 10 });

    if (isLoading) return <Spinner/> 

    return (
        <StockContext.Provider value={stock}>
            <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                <Divider/>
                <Heading>{stock?.name}</Heading>
                <Heading as="h5" size="sm">{stock?.ticker}, {stock?.exchange}</Heading>
            </div>
            <Tabs>
                <TabList mb={4}>
                    <Tab>Core</Tab>
                    <Tab>Dictionary</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Fundamentals/>
                    </TabPanel>
                    <TabPanel>
                        Dictionary
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </StockContext.Provider>
    )
}

export default Stock;