
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { time } = require('console');

const convertXmlFileToJson = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, xmlData) => {
            if (err) {
                reject(err);
            } else {
                const parser = new xml2js.Parser({ explicitArray: false });
                parser.parseString(xmlData, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
}

const eventIdCleansing = (data) => {
    data.forEach(element => {
        element.eventId = element.$.id; 
        delete element.$
    });
    return data;
};

const venueIdCleansing = (data) => {
    data.forEach(element => {
        element.venueId = element.$.id;
        delete element.$
    });
    return data;
};

const stringToDate = (str) => {
    const dateString = str.toString();
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const date = new Date(year, month, day);
    return date;
};

const eventDatesIndateCleansing = (data) => {
    data.forEach((element) => {
        if (typeof element.indate === 'string') {
            let date = stringToDate(element.indate);
            element.indate = date;
        }
        if (Array.isArray(element.indate)) {
            let dates = [];
            element.indate.forEach((subElement) => {
                let date = stringToDate(subElement);
                dates.push(date);
            });
            element.indate = dates;
        }
    });
    return data;
};

const priceToArray = (data) => {
    data.forEach((element) => {
        let inputString = element.pricee;
        const regex = /\d+/g;
        const prices = inputString.match(regex)?.map(Number) || "";
        element.prices = prices;
    });
    return data;
};

const removeChineseData = (data) => {
    data.forEach(element => {
        for (let key in element) {
            if (key.endsWith("c") || key.endsWith("C")) {
                delete element[key];
            }
        }
    });
    return data;
};

const removeRedundantE = (data) => {
    data.forEach(element => {
        Object.keys(element).forEach(key => {
            if (key.toLowerCase().endsWith('e') && key != 'saledate' && key != 'price' && key != 'latitude' && key != 'longitude') {
              const newKey = key.slice(0, -1);
              element[newKey] = element[key];
              delete element[key]
            }
        });
    });
    return data;
};

const cleanseData = (jsonData) => {
    console.log(jsonData);
    let data;
    switch (Object.keys(jsonData)[0]) {
        case 'event_dates':
            data = jsonData.event_dates.event;
            data = eventDatesIndateCleansing(data);
            data = eventIdCleansing(data);
            break;
        case 'events':
            data = jsonData.events.event;
            data = eventIdCleansing(data);
            data = priceToArray(data);
            data = removeChineseData(data);
            data = removeRedundantE(data);
            break;
        case 'venues':
            data = jsonData.venues.venue;
            data = venueIdCleansing(data);
            data = removeChineseData(data);
            data = removeRedundantE(data)
            break;
        default:
            break;
    }
    return data;
};

const directoryPath = './Data';

const writeAllJSON = async () => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(directoryPath, file);
            const fileExt = path.extname(file);

            if (fileExt === '.xml') {
                const jsonFileName = `${path.parse(file).name}.json`;
                const jsonFilePath = path.join(directoryPath, jsonFileName);
                convertXmlFileToJson(filePath)
                .then((jsonData) => {
                    let data = cleanseData(jsonData);

                    const jsonString = JSON.stringify(data, null, 2);

                    fs.writeFile(jsonFilePath, jsonString, 'utf8', (err) => {
                        if (err) {
                            console.error('Error writing JSON file:', jsonFileName, err);
                        } else {
                            console.log('JSON file saved:', jsonFileName);
                        }
                    });
                })
                .catch((err) => {
                    console.error('Error converting file:', file, err);
                });   
            }
        });
    });
};

const initDatabase = () => {
    writeAllJSON()
    .then(() => console.log('Tasks completed successfully.'))
    .catch((error) => console.error('Error:', error));
};

module.exports = {
    initDatabase
};