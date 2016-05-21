var React = require('react');

module.exports = Model;

function Model (debug) {
    this._debug = debug;
    this._raw = {};
    this._mapped = {
        rows: [],
        columns: [],
        index: new Map([
            ['yyyy-mm-dd', new Map()],
            ['yyyy-mm', new Map()],
            ['yyyy', new Map()]
        ]),
        distinct: new Set()
    };
}
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
    this._mapped.columns = cols;
};
Model.prototype._indexRow = function (row) {
    var id = row[':id'];

    // Index row object by ID
    if (!this.index.has(':id')) this.index.set(':id', new Map());
    this.index.get(':id').set(id, row);

    // Index row ID by year
    var y = row['noticedate'].slice(0,4);
    var m = row['noticedate'].slice(5,7);
    var ym = row['noticedate'].slice(0,7);
    var ymd = row['noticedate'].slice(0,10);

    row.year = y;
    row.month = m;
    row.yearMonth = ym;
    row.yearMonthDay = ymd;

    function _index (key, val, clas) {
        if (!this.index.get(key).has(val)) {
            this.index.get(key).set(val, new clas());
        }
        return this.index.get(key).get(val);
    }

    _index.call(this, 'yyyy', y, Set).add(id);
    _index.call(this, 'yyyy-mm', ym, Set).add(id);
    _index.call(this, 'yyyy-mm-dd', ymd, Set).add(id);

    // Index row ID by all columns
    var colObj;
    var i;
    var key;
    for ( i = 0; i < this.columns.length; i++ ) {
        colObj = this.columns[i];
        if (colObj) {
            key = colObj.key;
            if (key == ':id') continue;

            if (!this.index.has(key)) {
                this.index.set(key, new Map());
            }
            if (!this.index.get(key).has(row[key])) {
                this.index.get(key).set(row[key], new Set());
            }
            this.index.get(key).get(row[key]).add(id);
        }
    }
};

Model.prototype._mapRow = function (raw) {
    return {
        ':id': raw[1],
        'buildingaddress': raw[11],
        'noticedate': raw[12],
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
        this._indexRow(row);
        rows.push(row);
    }
    this._mapped.rows = rows;

    if (this._debug) console.log('Distinct neighborhood: ', this.index.get('neighborhood').size);
    if (this._debug) console.log('Distinct policedistrict: ', this.index.get('policedistrict').size);
    if (this._debug) console.log('Distinct councildistrict: ', this.index.get('councildistrict').size);
};
Model.prototype.filter = function (filters, rows) {
    if (!rows) rows = this.rows;
    var i = 0;
    var row;
    var matches;
    var filterKeys = Object.keys(filters);
    var filterKeysLen = filterKeys.length;
    var filterKey;
    var rowsLen = rows.length;
    var filtered = [];
    var j;
    for ( i; i < rowsLen; i++ ) {
        row = rows[i];
        matches = 0;
        for ( j = 0; j < filterKeysLen; j++ ) {
            filterKey = filterKeys[j];
            if (row[filterKey] && (row[filterKey] == filters[filterKey])) matches++;
            if (matches == filterKeysLen) filtered.push(row);
        }
    }
    return filtered;
};
Model.prototype.getById = function (id) {
    return this.index.get(':id').get(id);
};
