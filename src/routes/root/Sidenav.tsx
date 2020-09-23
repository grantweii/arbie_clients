import React, { FC } from 'react';
import { useRouteNode, Link } from 'react-router5';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Flex, Box, Button, Stack } from '@chakra-ui/core';
import SearchIcon from '../../common/assets/search.svg';
import GlobeIcon from '../../common/assets/globe.svg';
import * as styles from './RootStyles.scss';
import { mergeClasses } from '../../common/utils/utils';

type ILink = {
    label: string;
    routeName: string;
    icon: any;
}

const links: ILink[] = [
    {
        label: 'Stock',
        routeName: 'root.stock',
        icon: <SearchIcon/>,
    },
    {
        label: 'Discover',
        routeName: 'root.discover',
        icon: <GlobeIcon/>
    }
]

const getLinks = (link: ILink, currentRoute: string, index: number) => {
    const currentActive = currentRoute.includes(link.routeName);
    const linkStyle = mergeClasses(styles.link, currentActive && styles.activeLink);
    return (
        <Link key={`link-${index}`} routeName={link.routeName} className={linkStyle}>
            <Flex direction='row'>
                <Box className={styles.icon}>{link.icon}</Box>
                {link.label}
            </Flex>
        </Link>
    )
}


const Sidenav: FC<any> = ({ children, route }: any) => {
    const navigationLinks = links.map((link, index) => getLinks(link, route?.name, index));
    return (
        <Flex position='fixed' height='100%' direction='column' className={styles.sidenav}>
            {navigationLinks}
        </Flex>
    )
}

export default Sidenav;