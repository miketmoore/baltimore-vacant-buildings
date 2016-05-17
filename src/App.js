import React from 'react';
import {render} from 'react-dom';
require("react-data-grid/themes/react-data-grid.css");

var Top = require('./Top');


var dataSource = "data/baltimore-vacant-buildings.json";

render(
    <Top source={dataSource} />,
    document.getElementById('app')
);
