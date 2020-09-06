import React, { FC } from 'react';
import { useRouteNode } from 'react-router5';


const Discover: FC<any> = ({ children }) => {
    const { route } = useRouteNode('root.discover');
    return (
        <>Discover</>
    )
}

export default Discover;