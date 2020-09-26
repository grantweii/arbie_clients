import React, { FC, useMemo, useState } from 'react';
import { useRouteNode } from 'react-router5';
import { useQuery } from 'react-query';
import { getStock } from '../search/SearchActions';
import { Heading, Divider, Tab, TabList, Tabs, TabPanels, TabPanel, Spinner, Collapse, Text, Box, Stack, Flex, Stat, StatNumber, StatHelpText, StatArrow } from "@chakra-ui/core";
import Fundamentals from './Fundamentals';
import { isQueryLoading } from '../../common/utils/utils';
import * as styles from './Fundamentals.scss';
import { Hidden } from '../../common/components/Hidden';

export const StockContext = React.createContext(null);

type StatArrowDirection = 'increase' | 'decrease';

const Stock: FC<any> = ({ children }) => {
    const { route } = useRouteNode('root.stock.id');
    const { params } = route;
    const [infoVisible, toggleInfo] = useState(false);
    const { data: stock, isLoading } = useQuery(['stock', { id: params.id }], getStock, { staleTime: 60 * 1000 * 10 });

    const arrowDirection = useMemo(() => {
        let direction = 'neutral';
        if (stock?.changePercent > 0) direction = 'increase';
        if (stock?.changePercent < 0) direction = 'decrease';
        return direction;
    }, [stock?.changePercent]);

    if (isLoading) return <Spinner/> 

    return (
        <StockContext.Provider value={stock}>
            <Stack spacing={2} marginY={6}>
                <Box>
                    <Divider/>
                    <Stack isInline spacing={12}>
                        <Heading>{stock?.name}</Heading>
                        <Stat>
                            <StatNumber>
                                {stock?.close}
                            </StatNumber>
                            <StatHelpText>
                                <Hidden when={arrowDirection === 'neutral'}>
                                    <StatArrow type={arrowDirection as StatArrowDirection}/>
                                    {stock?.changePercent}%
                                </Hidden>
                                <Hidden when={arrowDirection !== 'neutral'}>
                                    -
                                </Hidden>
                            </StatHelpText>
                        </Stat>
                    </Stack>
                    <Heading as="h5" size="sm">{stock?.ticker}, {stock?.exchange}</Heading>
                    <Heading as='h5' size='sm'>{stock?.sector}, {stock?.industry}</Heading>
                </Box>
                <Stack spacing={2}>
                    <Collapse isOpen={infoVisible}>
                        <Text fontSize='sm'>{stock?.summary}</Text>
                    </Collapse>
                    <Flex>
                        <Text
                            fontSize='md'
                            onClick={() => toggleInfo(!infoVisible)}
                            className={styles.collapseButton}
                        >
                            { infoVisible ? 'Show less' : 'Show more' }
                        </Text>
                    </Flex>
                </Stack>
            </Stack>
            {children}
        </StockContext.Provider>
    )
}

export default Stock;