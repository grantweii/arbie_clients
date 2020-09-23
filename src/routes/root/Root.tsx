import React, { FC } from 'react';
import { useRouteNode, Link } from 'react-router5';
import { Flex, Box } from '@chakra-ui/core';
import Search from '../search/Search';
import Arbie from '../../common/assets/arbie.svg';
import Sidebar from './Sidenav';


const Root: FC<any> = ({ children }) => {
    const { route } = useRouteNode('root');
    return (
        <Flex height='100%' width='100%' >
            <Sidebar route={route}/>
            <Box paddingLeft={40} margin={6} height='100%' width='100%'>
                {children}
            </Box>
        </Flex>
    )
}

export default Root;