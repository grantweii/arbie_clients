import React, { FC } from 'react';
import { useRouteNode } from 'react-router5';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Flex, Box, Heading } from '@chakra-ui/core';
import Search from '../search/Search';
import * as styles from './arbie.scss';
import Arbie from '../../common/assets/arbie.svg';

const welcomeMessages = [
    'Arbie says hi!',
    'Welcome to Arbie!',
    'The Wolf of Wall Street, Arbie!',
    'Kaching, Arbie is ready to make money!',
    'Lets get this breeeaaad!'
];

const Welcome: FC<any> = ({ children }) => {
    const { route } = useRouteNode('root.welcome');
    const index = Math.floor(Math.random() * 5);    
    return (
        <>
            <Box className={styles.arbie}><Arbie/></Box>
            <Heading as='h1' size='xl' textAlign='center'>{welcomeMessages[index]}</Heading>
        </>
    )
}

export default Welcome;