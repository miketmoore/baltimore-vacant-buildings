module.exports = {
    connect: function (params) {
        var xhr = new params.XMLHttpRequest();
        xhr.open('GET', encodeURI(params.source));
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                params.model.setRaw(data);
                this.setState({
                    columns: params.model.columns
                });
            }
            else {
                throw new Error('Server request for data failed. Status: ' + xhr.status);
            }
        }.bind(this);
        xhr.send();
    }
};
