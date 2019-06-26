import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';

//import '../node_modules/leaflet/dist/leaflet';
//import '../node_modules/react-leaflet/dist/react-leaflet';
//import '../node_modules/leaflet.markercluster/dist/MarkerCluster.css';
//import '../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css';
//import '../node_modules/leaflet.markercluster/dist/leaflet.markercluster';

import AppRoutes from './routes'

render(

    <Router>
        <AppRoutes />
    </Router>,
    document.getElementById('root')

);