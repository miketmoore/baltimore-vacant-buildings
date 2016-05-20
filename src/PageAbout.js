var React = require('react');
var Layout = require('./Layout');

module.exports = React.createClass({
    render () {
        return (
            <Layout>
                <p>Baltimore vacant building data from <a href="https://data.baltimorecity.gov/" title="https://data.baltimorecity.gov/">https://data.baltimorecity.gov/</a></p>
            </Layout>
        );
    }
})
