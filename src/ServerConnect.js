module.exports = {
    connect: function (params) {
        var xhr = new params.XMLHttpRequest();
        xhr.open('GET', encodeURI(params.source));
        xhr.onload = function () {
            params.onload.call(this, xhr);
        };
        xhr.send();
    }
};
