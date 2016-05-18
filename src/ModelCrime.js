var React = require('react');

module.exports = Model;

function Model () {
    this._raw = {};
    this._mapped = {
        rows: [],
        columns: [],
        index: new Map(),
        distinct: new Set()
    };
}
Object.defineProperties(Model.prototype, {
    "rows": { get: function () { return this._mapped.rows; } },
    "columns": { get: function () { return this._mapped.columns; } },
    "index": { get: function () { return this._mapped.index; } }
});
Model.prototype.setRaw = function (raw) {
    this._raw = raw;
    this.map();
};
Model.prototype.map = function () {
    this._mapRows();
    console.log('CRIME MODEL: ', this);
};
Model.prototype._indexRow = function (row) {

};
Model.prototype._mapRows = function () {
    var raw = this._raw;
    var rows = [];
    var row;
    var keys;
    var key;
    var columns = new Set();
    var j;
    var id;
    for (var i = 0, len = raw.length; i < len; i++) {
        row = raw[i];
        row.id = i+1;
        keys = Object.keys(row);
        for ( j = 0; j < keys.length; j++ ) {
            key = keys[j];
            if (!columns.has(key)) columns.add(key);
        }
        this._indexRow(row);
        rows.push(row);
    }
    this._mapped.columns = Array.from(columns.values());
    this._mapped.rows = rows;
    console.log('COLUMNS: ', columns);
    console.log('TOTAL ROWS: ', rows.length);
    console.log('FINISHED');
};
