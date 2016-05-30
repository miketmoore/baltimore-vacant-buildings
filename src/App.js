import React from 'react';
import {render} from 'react-dom';
require("react-data-grid/themes/react-data-grid.css");
var paper = require('paper');

var Top = require('./Top');
var Model = require('./Model');
var model = new Model();
var dataSource = "data/baltimore-vacant-buildings.json";

render(
    <Top 
        XMLHttpRequest={XMLHttpRequest}
        source={dataSource}
        model={model}
        paper={paper}
    />,
    document.getElementById('app')
);
