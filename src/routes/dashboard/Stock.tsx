import React, { FC } from 'react';
import { useRouteNode } from 'react-router5';
import { useQuery } from 'react-query';
import { getStock } from './DashboardActions';
import { Heading, Divider } from "@chakra-ui/core";

const Stock: FC<any> = ({ children }) => {
    const { route } = useRouteNode('stock.id');
    const { params } = route;
    const { data: stock } = useQuery(['stocks', { id: params.id }], getStock, { staleTime: 60 * 1000 * 10 });

    return (
        <React.Fragment>
            <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                <Divider/>
                <Heading>{stock?.name}</Heading>
                <Heading as="h5" size="sm">{stock?.ticker}, {stock?.exchange}</Heading>
            </div>
            {children}
        </React.Fragment>
    )
}

export default Stock;