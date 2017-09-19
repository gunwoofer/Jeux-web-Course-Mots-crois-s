import { MongoClient } from 'mongodb';

export class BDImplementation {
    public seConnecter(url: string, fonctionDeRappel: any) {
        MongoClient.connect(url, fonctionDeRappel);
    }
}
