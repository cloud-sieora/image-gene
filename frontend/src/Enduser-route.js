import React from 'react';

const Login = React.lazy(() => import('./BillingApp_Components/Authentication/SignIn/SignIn1'));

const route = [
    { path: '/Login', exact: true, name: 'Login', component: Login },
];

export default route;