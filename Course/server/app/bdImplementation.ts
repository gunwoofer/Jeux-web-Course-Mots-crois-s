import mongoose = require('mongoose');

export class BdImplementation {

    public connect(url: string): boolean {
        mongoose.Promise = global.Promise;
        mongoose.connect(url, { useMongoClient: true });
        mongoose.connection.on('error', error => {
          console.error(error);
          return false;
        });
        return true;
    }
}
