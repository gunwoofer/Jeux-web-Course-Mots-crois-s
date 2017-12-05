import { Injectable } from '@angular/core';
import { ConnexionTempsReelClient } from './connexionTempsReelClient';


@Injectable()
export class ConnexionTempsReelClientService {
    public connexionTempsReelClient: ConnexionTempsReelClient;

    constructor() {
        this.connexionTempsReelClient = new ConnexionTempsReelClient();
    }
}
