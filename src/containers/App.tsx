import React, { FC } from 'react';
import { RouterProvider } from 'react-router5';
import AppLayout from '../layouts/AppLayout';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { Auth0Provider } from '@auth0/auth0-react';

type Props = {
    router?: any;
}

const AppContainer: FC<Props> = ({ router }) => {;
    return (
        <RouterProvider router={router}>
            <ThemeProvider>
                <Auth0Provider
                    domain={process.env.AUTH0_DOMAIN}
                    clientId={process.env.AUTH0_CLIENT_ID}
                    redirectUri={window.location.origin}
                >
                    <CSSReset/>
                    <AppLayout/>
                </Auth0Provider>
            </ThemeProvider>
        </RouterProvider>
    );
}

export default AppContainer;