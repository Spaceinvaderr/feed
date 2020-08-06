"use strict";
exports.__esModule = true;
var fs = require("fs");
var xml_stream_1 = require("xml-stream");
var moment = require("moment");
var fileStream = fs.createReadStream('./feed.xml');
var xmlStream = new xml_stream_1(fileStream);
var writeStream = fs.createWriteStream('./feed_out.xml');
xmlStream.on('endElement: offer', function (offer) {
    //writeStream.write(setActivity(offer));
    setActivity(offer);
    console.log(offer);
});
xmlStream.on('end', function () {
    writeStream.end();
    console.log("Done");
});
function setActivity(offer) {
    var currentTime = moment().utc();
    var currentHour = currentTime.hour();
    var currentDay = currentTime.day();
    if (offer && offer.opening_times) {
        var openingTimes = JSON.parse(offer.opening_times);
        if (openingTimes[currentDay].length !== 0) {
            for (var _i = 0, _a = openingTimes[currentDay]; _i < _a.length; _i++) {
                var hours = _a[_i];
                if (moment(hours.opening, 'HH:mm').isBefore(currentHour) && moment(hours.closing, 'HH:mm').isAfter(currentHour)) {
                    offer.is_active = true;
                }
                else {
                    offer.is_active = false;
                }
            }
        }
    }
    return offer;
}
