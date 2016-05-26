var React = require('react');
var Drawing = require('./Drawing');
var Button = require('./Button');

module.exports = React.createClass ({
    getInitialState () {
        return {
            data: [],
            limit: 5,
            page: 0,
            
            totalPages: 0
        };
    },
    back () {
        if (this.state.page > 0) {
            this.setState({
                page: this.state.page - 1
            });
        }
    },
    forward () {
        this.setState({
            page: this.state.page + 1
        });
    },
    isBackDisabled () {
        return this.state.page == 0;
    },
    isForwardDisabled () {
        var total = this.props.model.index.get('year').size;
        var limit = this.state.limit;
        var page = this.state.page;
        var offset = (limit * page) + limit;
        return total == offset;
    },
    _determineTotalPages () {
        var total = this.props.model.index.get('year').size;
        var limit = this.state.limit;
        return Math.ceil(total/limit);
    },
    _init () {
        var data = [];
        var map = this.props.model.index.get('year');
        var size;
        var year;
        var idSet;
        var entries = Array.from(map.entries());
        var entry;
        for ( var i = 0; i < entries.length; i++ ) {
            entry = entries[i];
            year = entry[0];
            idSet = entry[1];
            size = idSet.size;
            data.push({year:year,size:size});
        }
        this.setState({
            data: data,
            totalPages: this._determineTotalPages()
        });
    },
    componentWillReceiveProps (props) {
        this._init();
    },
    // Immediately before initial rendering
    // This is run before rendering when switching to the route
    componentWillMount () {
        this._init();
    },
    render () {
        if (!this.state.data.length) return null;
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-8">
                                    <h4>Total vacant buildings per year</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="btn-group" role="group">
                                        <Button disabled={this.isBackDisabled()} callback={this.back} text="Back"/>
                                        <Button disabled={this.isForwardDisabled()} callback={this.forward} text="Forward"/>
                                    </div>
                                    <span className="pull-right">Page {this.state.page+1}/{this.state.totalPages}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                    <Drawing
                                        data={this.state.data}
                                        limit={this.state.limit}
                                        page={this.state.page}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
