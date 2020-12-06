
import Search from '../routes/search/Search';
import Fundamentals from '../routes/fundamentals/Fundamentals';
import Stock from '../routes/fundamentals/Stock';
import Root from '../routes/root/Root';
import Welcome from '../routes/root/Welcome';
import Discover from '../routes/discover/Discover';
import Backtest from '../routes/backtest/Backtest';

export default [
    {
        name: 'root',
        path: '/',
        component: Root,
        forwardTo: 'root.welcome',
        children:[
            {
                name: 'welcome',
                path: 'welcome',
                component: Welcome,
            },
            {
                name: 'stock',
                path: 'stock', // no slash because root has / already
                component: Search,
                children: [
                    {
                        name: 'id',
                        path: '/:id',
                        component: Stock,
                        forwardTo: 'root.stock.id.fundamentals',
                        children: [
                            {
                                name: 'fundamentals',
                                path: '/fundamentals',
                                component: Fundamentals,
                            }
                        ]
                    }
                ]
            },
            {
                name: 'discover',
                path: 'discover',
                component: Discover,
            },
            {
                name: 'backtest',
                path: 'backtest',
                component: Backtest,
            }
        ]
    }
];