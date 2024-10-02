import React, { Component, Suspense, useEffect, useState, useRef } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Printer from "./Printer"
import io from 'socket.io-client'
import * as api from '../BillingApp_Components/Configurations/Api_Details'
import { SOCKET } from '../store/actions'
import { useDispatch } from 'react-redux'

import '../../node_modules/font-awesome/scss/font-awesome.scss';

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import routes from "../route";

let socket
const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'),
    loading: Loader
});

function App(props) {
    const dispatch = useDispatch()

    useEffect(() => {
        socket = io(api.BACKEND_URI, { transports: ['websocket'] });

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        socket.on('frontend', function (a) {
            dispatch({ type: SOCKET, value: socket })
            console.log(a);
            console.log(socket.id);
        })

    }, [])

    const menu = routes.map((route, index) => {
        return (route.component) ? (
            <Route
                key={index}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={props => (
                    <route.component {...props} />
                )} />
        ) : (null);
    });

    return (
        <Aux>
            <ScrollToTop>
                <Suspense fallback={<Loader />}>
                    <Switch>
                        {menu}
                        <Route path="/" component={AdminLayout} />
                    </Switch>
                </Suspense>
            </ScrollToTop>
        </Aux>
    );

}

export default App;
