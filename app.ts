import * as fs from 'fs';
import * as XmlStream from 'xml-stream';
import * as moment from 'moment';
import * as xmlBuilder from 'xml2js';

let fileStream = fs.createReadStream('./feed.xml');
let xmlStream = new XmlStream(fileStream);
let writeStream = fs.createWriteStream('./feed_out.xml');
let builder = new xmlBuilder.Builder({cdata: true}); 

xmlStream.on('endElement: offer', offer => {
    writeStream.write(builder.buildObject(setActivity(offer)));
    //console.log(builder.buildObject(setActivity(offer)));
});

xmlStream.on('end', () => {
    writeStream.end();
    console.log("Done");
});

function setActivity(offer) {
    let currentTime = moment().utc();
    let currentHour = currentTime.hour();
    let currentDay = currentTime.day();
    
    if(offer && offer.opening_times) {
        let openingTimes = JSON.parse(offer.opening_times);
        if(openingTimes[currentDay]) {
            for(let hours of openingTimes[currentDay]) {
                if(moment(hours.opening, 'HH:mm').isBefore(currentHour) && moment(hours.closing, 'HH:mm').isAfter(currentHour)) {
                    offer.is_active = true;
                } else {
                    offer.is_active = false;    
                }
            }
        } 
    }
    return offer;
}