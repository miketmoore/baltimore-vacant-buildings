module.exports = {
    connect: function (params) {
        var xhr = new params.XMLHttpRequest();
        xhr.open('GET', encodeURI(params.source));
        xhr.onload = params.onload.bind(xhr);
        xhr.send();
    }
};
