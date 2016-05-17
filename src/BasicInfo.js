var React = require('react');
var ListItem = require('./ListItem');

module.exports = React.createClass ({
    getDefaultProps () {
        return {
            model: {}
        };
    },
    buildList (dataArray, objKey) {
        var colList = [];
        var val;
        for ( var i = 0; i < dataArray.length; i++ ) {
            val = dataArray[i];
            if (objKey) val = val[objKey];
            colList.push(<ListItem itemKey={val} />);
        }
        return colList;
    },
    render () {
        var years = this.props.model.getDistinct('yyyy');
        return (
            <div className="row">
                <div className="col-md-6">
                    <h3>Fields</h3>
                    <ol>
                        {this.buildList.call(this, this.props.model.columns, 'key')}
                    </ol>
                </div>
                <div className="col-md-6">
                    <h3>Years</h3>
                    <ol>
                        {this.buildList.call(this, years)}
                    </ol>
                </div>
            </div>
        )
    }
});
