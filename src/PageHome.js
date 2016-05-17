var React = require('react');
var Layout = require('./Layout');

module.exports = React.createClass({
    render () {
        return (
            <Layout>
                <p>This is a single page application that loads a single data source from a server-side JSON file.</p>
                <p>The app is powered by express.js, React, Bootstrap, paper.js, and various other dependencies.</p>
            </Layout>
        )
    }
})
