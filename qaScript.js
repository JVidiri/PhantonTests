// Render Multiple URLs to file

"use strict";
system = require("system");
var fs = require('fs');

var RenderUrlsToFile, arrayOfUrls, system;
var content = '',
    f = null,
    lines = null,
    eol = system.os.name == 'windows' ? "\r\n" : "\n",
    pageSiteUrl = '',
    t = null;

/*
Render given urls
@param array of URLs to render
@param callbackPerUrl Function called after finishing each URL, including the last URL
@param callbackFinal Function called after finishing everything
*/
RenderUrlsToFile = function(urls, callbackPerUrl, callbackFinal) {
    var getFilename, next, page, retrieve, urlIndex, webpage;
    urlIndex = 0;
    webpage = require("webpage");
    page = null;
    getFilename = function() {
        return "rendermulti-" + urlIndex + ".png";
    };
    next = function(status, url, file) {
        page.close();
        callbackPerUrl(status, url, file);
        return retrieve();
    };
    retrieve = function() {
        var url;
        if (urls.length > 0) {
            url = urls.shift();
            urlIndex++;
            page = webpage.create();
            page.viewportSize = {
                width: 1920,
                height: 1080
            };
            page.settings.userAgent = "Phantom.js bot";
            return page.open("http://" + url, function(status) {
                var file;
                file = getFilename();
                if (status === "success") {
                    return window.setTimeout((function() {
                        page.render(file);
                        return next(status, url, file);
                    }), 200);
                } else {
                    return next(status, url, file);
                }
            });
        } else {
            return callbackFinal();
        }
    };
    return retrieve();
};

arrayOfUrls = null;

if (system.args.length > 1) {
    try {
        f = fs.open(system.args[1], "r");
        content = f.read();
    } catch (e) {
        console.log(e);
    }

    if (f) {
        f.close();
    }
    if (content) {
        arrayOfUrls = content.split(eol);
    }
} else {
    console.log("Usage: phantomjs <scriptName>.js newLineSeparatedFile.txt");
    arrayOfUrls = ["www.edinteractive.cc"];
}

RenderUrlsToFile(arrayOfUrls, (function(status, url, file) {
    if (status !== "success") {
        return console.log("Unable to render '" + url + "'");
    } else {
        return console.log("Rendered '" + url + "' at '" + file + "'");
    }
}), function() {
    return phantom.exit();
})
