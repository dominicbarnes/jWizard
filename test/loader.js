/*jshint evil: true */
(function (v) {
    var base = "http://ajax.googleapis.com/ajax/libs/";

    function js(src) {
        document.write('<script src="' + src + '"></script>');
    }

    function css(href) {
        document.write('<link rel="stylesheet" type="text/css" href="' + href + '">');
    }

    js(base + "jquery/" + v.jquery + "/jquery.js");
    js(base + "jqueryui/" + v.jqueryui + "/jquery-ui.js");
    css(base + "jqueryui/" + v.jqueryui + "/themes/base/jquery-ui.css");
})(window.versions);
