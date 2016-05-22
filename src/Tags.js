var React = require('react');
var TagDeleteButton = require('./TagDeleteButton');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            data: []
        };
    },
    _getTags () {
        var data = this.props.data;
        var tags = [];
        data.forEach((v) => {
            tags.push(<span key={v.key} className="label label-primary mm-label right-margin">{v.label} <TagDeleteButton clickHandler={v.onDelete} /></span>)
        });
        return tags;
    },
    render () {
        var tags = this._getTags();
        return (
            <div>{tags}</div>
        );
    }
});
