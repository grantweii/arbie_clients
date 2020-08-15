import React, { FC } from 'react';
import { RouterProvider } from 'react-router5';
import AppLayout from '../layouts/AppLayout';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import * as styles from './App.scss';

type Props = {
    router?: any;
}

const AppContainer: FC<Props> = ({ router }) => {
    return (
        <RouterProvider router={router}>
            <ThemeProvider>
                <CSSReset/>
                <div className={styles.app}>
                    <AppLayout/>
                </div>
            </ThemeProvider>
        </RouterProvider>
    );
}

export default AppContainer;