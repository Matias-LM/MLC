// Dependencies
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Components
import App from './components/App';
import Home from './components/Home';
import LoguedIn from './components/LoguedIn';
import Page404 from './components/Page404';

const AppRoutes = () =>
    <App>

        <Switch>

            <Route exact path="/" component={Home} />
            <Route exact path="/logued_in" component={LoguedIn} />
            <Route component={Page404} />

        </Switch>

    </App>;

export default AppRoutes;