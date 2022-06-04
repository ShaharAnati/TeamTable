const { MongoMemoryServer } = require('mongodb-memory-server');

// This will create an new instance of "MongoMemoryServer" and automatically start it
// const mongod = await MongoMemoryServer.create();

async function init() {
    const mongod = new MongoMemoryServer({
        instance: {
          port: 9468,
          dbName: 'TeamTable',
          dbPath: './dev-mongo-data',
          storageEngine: 'wiredTiger', // by default `ephemeralForTest`, available engines: [ 'ephemeralForTest', 'wiredTiger' ]
        }
      });
    
    await mongod.start();
    
    const uri = mongod.getUri();
    console.log(uri)
    // The Server can be stopped again with
    // await mongod.stop();
}

init();
