import React from 'react';
import {render} from 'react-dom';
require("react-data-grid/themes/react-data-grid.css");

var Top = require('./Top');

var dataSources = new Map();
dataSources.set('vacancies', "data/baltimore-vacant-buildings.json");
dataSources.set('crime', "data/bpd-part-1-victim-based-crime.json");

render(
    <Top dataSources={dataSources} />,
    document.getElementById('app')
);
