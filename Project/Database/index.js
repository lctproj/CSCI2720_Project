
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const moment = require('moment');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { time } = require('console');

const uri = "mongodb+srv://CSCi2720:CSCI2720@csci2720project.nrracpp.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

function convertXmlFileToJson(filePath) {
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

const importJsonListToMongoDB = async (jsonList, collectionName) => {
    try {
        await client.connect(); // Connect to MongoDB server
        const database = client.db('CSCI2720Project'); // Specify the database name
        const collection = database.collection(collectionName); // Specify the collection name

        // Check if the collection exists
        const collectionExists = await collection.findOne({});

        if (collectionExists) {
            // Delete the collection if it exists
            await collection.drop();
            console.log('Collection deleted:', collectionName);
        }

        // Recreate the collection and import the data
        const result = await collection.insertMany(jsonList);
        console.log('JSON list imported to MongoDB:', result.insertedIds);
    } catch (error) {
        console.error('Error importing JSON list to MongoDB:', error);
    } finally {
        client.close(); // Close the MongoDB connection
    }
}


const directoryPath = './Data';

const convertAllXMLtoJSON = async () => {
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

                if (!fs.existsSync(jsonFilePath)) {
                    convertXmlFileToJson(filePath)
                        .then((json) => {
                            const jsonString = JSON.stringify(json, null, 2);

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
                } else {
                    console.log('JSON file already exists:', jsonFileName);
                }
            }
        });
    });
};

const idCleansing = (data) => {
    data.forEach(element => {
        element._id = element.$.id
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
}

const storeAllJSONtoMongo = async () => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const fileExt = path.extname(file);

            if (fileExt === '.json') {
                const jsonFileName = `${path.parse(file).name}.json`;
                const jsonFilePath = path.join(directoryPath, jsonFileName);

                fs.readFile(jsonFilePath, 'utf8', (err, jsonString) => {
                    if (err) {
                        console.error('Error reading JSON file:', jsonFileName, err);
                    } else {
                        console.log(jsonString);
                        const jsonData = JSON.parse(jsonString);
                        console.log(jsonData);
                        let data;
                        switch (Object.keys(jsonData)[0]) {
                            case 'event_dates':
                                data = jsonData.event_dates.event;
                                data = eventDatesIndateCleansing(data);
                                break;
                            case 'events':
                                data = jsonData.events.event;
                                data = priceToArray(data);
                                break;
                            case 'venues':
                                data = jsonData.venues.venue;
                                break;
                            default:
                                break;
                        }
                        const collectionName = path.parse(file).name;
                        console.log(`${collectionName} is type of ${typeof collectionName}`);
                        data = idCleansing(data)
                        
                        importJsonListToMongoDB(data, collectionName);
                    }
                });
            }
        });
    });
};

convertAllXMLtoJSON()
    .then(() => {
        // Add a waiting time of 1 second (1000 milliseconds)
        return new Promise((resolve) => setTimeout(resolve, 500));
    })
    .then(() => storeAllJSONtoMongo())
    .then(() => console.log('Tasks completed successfully.'))
    .catch((error) => console.error('Error:', error));