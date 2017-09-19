import { assert } from 'chai';

export enum TypeObservateur{
    Validateur,
    Autre
}

export class Observateur {
    private type: TypeObservateur;

    constructor(type: TypeObservateur = TypeObservateur.Autre) {
        this.type = type;
    }

    public notifier() {
        switch(this.type) {
            case TypeObservateur.Validateur:
                assert(true);
            break;
        }
    }
}
