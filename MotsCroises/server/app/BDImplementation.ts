import { MongoClient } from 'mongodb';

export class BDImplementation {
    public seConnecter(url: string, fonctionDeRappel: any): void {
        MongoClient.connect(url, fonctionDeRappel);
    }
}
