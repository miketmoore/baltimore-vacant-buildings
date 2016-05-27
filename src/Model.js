var React = require('react');

module.exports = Model;

function Model (debug) {
    this._debug = debug;
    this._raw = {};
    this._mapped = {
        rows: [],
        columns: [],
        index: new Map([
            [':id', new Map()],
            ['year', new Map()],
            ['month', new Map()],
            ['day', new Map()],
            ['sortedBlocks', []],
            ['sortedLots', []],
            ['sortedYears', []]
        ])
    };

    this._indexRange(1,31,'days');
    this._indexRange(1,12,'months');
};
Model.prototype._indexRange = function (a, b, key) {
    var range = [];
    var str;
    for ( var i = a; i <= b; i++ ) {
        if (i <= 9) str = '0' + i;
        else str = i.toString();
        range.push(str);
    }
    this._mapped.index.set(key, range);
};
Object.defineProperties(Model.prototype, {
    "rows": { get: function () { return this._mapped.rows; } },
    "columns": { get: function () { return this._mapped.columns; } },
    "index": { get: function () { return this._mapped.index; } }
});
Model.prototype.setRaw = function (raw) {
    if (!raw) return Promise.reject('setRaw failed - no raw data passed');
    if (!raw.meta) return Promise.reject('setRaw failed - raw data is missing "meta" property');
    if (!raw.meta.view) return Promise.reject('setRaw failed - raw data is missing "meta.view" property');
    if (!raw.meta.view.columns) return Promise.reject('setRaw failed - raw data is missing "meta.view.columns" property');
    if (!raw.data) return Promise.reject('setRaw failed - raw data is missing "data" property');
    this._raw = raw;
    this.map();
    this.index.set('sortedBlocks', Array.from(this.index.get('block').keys()).sort());
    this.index.set('sortedLots', Array.from(this.index.get('lot').keys()).sort());
    this.index.set('sortedYears', Array.from(this.index.get('year').keys()).sort());
    return Promise.resolve();
};
Model.prototype.map = function () {
    this._mapColumns();
    this._mapRows();
};
Model.prototype._mapColumns = function () {
    var raw = this._raw.meta.view.columns;
    var cols = [];
    var col;
    for (var i = 0; i < raw.length; i++) {
        col = raw[i];
        if (!col) {
            cols.push(null);
        } else {
            cols.push({
                key: col.fieldName,
                name: col.name,
                resizable: true
            });
        }

    }
    if (this._debug) console.log('_mapColumns final ', cols);
    this._mapped.columns = cols;
};
Model.prototype._indexRowDatePieces = function (row) {
    var configs = [
        { start: 0, end: 4, key: 'year' },
        { start: 5, end: 7, key: 'month' },
        { start: 8, end: 10, key: 'day' }
    ];
    var config, val;
    var vals = [];
    var index;
    for ( var i = 0; i < configs.length; i++ ) {
        config = configs[i];
        val = row.noticedate.slice(config.start,config.end);
        vals.push(val);
        index = this.index.get(config.key);
        if (!index.has(val)) index.set(val, new Set());
        if (!index.get(val).has(row[':id'])) index.get(val).add(row[':id']);
        row[config.key] = val;
    }
};
Model.prototype._indexRowByCols = function (row) {
    var colObj;
    var i;
    var key;
    var id = row[':id'];
    for ( i = 0; i < this.columns.length; i++ ) {
        colObj = this.columns[i];
        if (colObj) {
            key = colObj.key;
            if (key == ':id') continue;
            if (!this.index.has(key)) this.index.set(key, new Map());
            if (!this.index.get(key).has(row[key])) this.index.get(key).set(row[key], new Set());
            this.index.get(key).get(row[key]).add(id);
        }
    }
};

Model.prototype._mapRow = function (raw) {
    return {
        ':id': raw[1],
        'block': raw[9],
        'lot': raw[10],
        'buildingaddress': raw[11],
        'noticedate': raw[12].slice(0,10), // slice off time since times are all the same
        'neighborhood': raw[13],
        'policedistrict': raw[14],
        'councildistrict': raw[15],
        'location': raw[16]
    };
};
Model.prototype._mapRows = function () {
    var raw = this._raw.data;
    var rows = [];
    var row;
    for (var i = 0, len = raw.length; i < len; i++) {
        row = this._mapRow(raw[i]);
        this.index.get(':id').set(row[':id'], row);
        this._indexRowByCols(row);
        this._indexRowDatePieces(row);
        rows.push(row);
    }
    this._mapped.rows = rows;

    if (this._debug) console.log('Distinct neighborhood: ', this.index.get('neighborhood').size);
    if (this._debug) console.log('Distinct policedistrict: ', this.index.get('policedistrict').size);
    if (this._debug) console.log('Distinct councildistrict: ', this.index.get('councildistrict').size);
};
Model.prototype.filter = function (filters, rows) {
    if (!rows) rows = this.rows;
    if (!Object.keys(filters).length) return rows;
    var i = 0;
    var row;
    var matches;
    var filterKeys = Object.keys(filters);
    var filterKeysLen = filterKeys.length;
    var filterKey;
    var filterValues;
    var filterValue;
    var rowsLen = rows.length;
    var rowVal;
    var filtered = [];
    var j;
    for ( i; i < rowsLen; i++ ) {
        row = rows[i];
        matches = 0;
        for ( j = 0; j < filterKeysLen; j++ ) {
            filterKey = filterKeys[j];
            rowVal = row[filterKey];
            filterValues = filters[filterKey];
            if (Array.isArray(filterValues)) {
                filterValues = new Set(filterValues);
                if (filterValues.has(rowVal)) matches++;
            } else {
                if (rowVal == filterValues) matches++;
            }

            if (matches == filterKeysLen) filtered.push(row);
        }
    }
    return filtered;
};
Model.prototype.getById = function (id) {
    return this.index.get(':id').get(id);
};
