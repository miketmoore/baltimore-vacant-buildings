var React = require('react');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            values: [],
            title: "Select One",
            liveSearch: false,
            dataStyle: 'btn-default',
            currentValue: ''
        };
    },
    getInitialState () {
        return {
            values: []
        }
    },
    changeHandler (event) {
        var val = event.target.value;
        if (this.props.changeHandler) this.props.changeHandler(val);
    },
    componentDidMount () {
        this.setState({
            values: this.props.values
        });
    },
    componentDidUpdate () {
        $('.selectpicker').selectpicker('refresh');
    },
    render () {
        var options = this.props.values.map((val) => {
            return (
                <option value={val} key={val}>{val}</option>
            );
        });
        return (
           <select
               title={this.props.title}
               className="selectpicker show-tick right-margin"
               data-live-search={this.props.liveSearch}
               data-width="fit"
               data-style={this.props.dataStyle}
               value={this.props.currentVal}
               onChange={this.changeHandler}>{options}</select>
        )
    }
})
