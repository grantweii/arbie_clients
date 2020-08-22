
import Dashboard from '../routes/dashboard/Dashboard';
import Fundamentals from '../routes/fundamentals/Fundamentals';
import Stock from '../routes/core/Stock';

export default [
    {
        name: 'stock',
        path: '/stock',
        component: Dashboard,
        children: [
            {
                name: 'id',
                path: '/:id',
                component: Stock,
                forwardTo: 'stock.id.fundamentals',
                children: [
                    {
                        name: 'fundamentals',
                        path: '/fundamentals',
                        component: Fundamentals,
                    }
                ]
            }
        ]
    }
];