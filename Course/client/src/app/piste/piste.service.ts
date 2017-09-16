import { Piste } from './piste.model';

export class PisteService {
    private pistes: Piste[] = [];

    addPiste(piste: Piste){
        this.pistes.push(piste);
    }

    getlistPistes(piste: Piste){
        return this.pistes;
    }
}