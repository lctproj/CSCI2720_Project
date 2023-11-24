
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { MongoClient, ServerApiVersion } = require('mongodb');

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

async function importJsonListToMongoDB(jsonList, collectionName) {
    try {
        await client.connect(); // Connect to MongoDB server
        const database = client.db('CSCI2720Project'); // Specify the database name
        const collection = database.collection(collectionName); // Specify the collection name

        const result = await collection.insertMany(jsonList); // Insert the JSON list into the collection
        console.log('JSON list imported to MongoDB:', result.insertedIds);
    } catch (error) {
        console.error('Error importing JSON list to MongoDB:', error);
    } finally {
        client.close(); // Close the MongoDB connection
    }
}


const directoryPath = './Data';


const convertAllXMLtoJSON = () => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);
            const fileExt = path.extname(file);

            if (fileExt === '.xml') {
                convertXmlFileToJson(filePath)
                    .then(json => {
                        const jsonFileName = `${path.parse(file).name}.json`;
                        const jsonFilePath = path.join(directoryPath, jsonFileName);
                        const jsonString = JSON.stringify(json, null, 2);

                        fs.writeFile(jsonFilePath, jsonString, 'utf8', err => {
                            if (err) {
                                console.error('Error writing JSON file:', jsonFileName, err);
                            } else {
                                console.log('JSON file saved:', jsonFileName);
                            }
                        });
                    })
                    .catch(err => {
                        console.error('Error converting file:', file, err);
                    });
            }
        });
    });
};

const storeAllJSONtoMongo = () => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);
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
                                break;
                            case 'events':
                                data = jsonData.events.event;
                                break;
                            case 'venues':
                                data = jsonData.venues.venue;
                                break;
                            default:
                                break;
                        }

                        const collectionName = path.parse(file).name;
                        importJsonListToMongoDB(data, collectionName);
                    }
                });
            }
        });
    });
};


convertAllXMLtoJSON();
storeAllJSONtoMongo();