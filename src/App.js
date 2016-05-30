import React from 'react';
import {render} from 'react-dom';
require("react-data-grid/themes/react-data-grid.css");

var Top = require('./Top');


var dataSource = "data/baltimore-vacant-buildings.json";

var model = new Model();

render(
    <Top 
        xmlHttpRequest={XMLHttpRequest}
        source={dataSource}
        model={model}
    />,
    document.getElementById('app')
);
