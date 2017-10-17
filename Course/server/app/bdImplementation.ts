import mongoose = require('mongoose');

export class BdImplementation {

    public connect(): boolean {
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/Bdpiste', { useMongoClient: true });
        mongoose.connection.on('error', error => {
          console.error(error);
          return false;
        });
        return true;
    }

}
