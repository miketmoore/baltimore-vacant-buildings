var React = require('react');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            liveSearch: false,
            dataStyle: 'btn-primary'
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
    componentWillReceiveProps (props) {
        this.setState({
            values: props.values
        });
    },
    render () {
        var options = this.state.values.map((val) => {
            return (
                <option value={val}  key={val}>{val}</option>
            );
        });
        return (
           <select
               className="selectpicker show-tick"
               data-live-search={this.props.liveSearch}
               data-width="fit"
               data-style={this.props.dataStyle}
               value={this.props.currentVal}
               onChange={this.changeHandler}>
               {options}
           </select>
        )
    }
})
