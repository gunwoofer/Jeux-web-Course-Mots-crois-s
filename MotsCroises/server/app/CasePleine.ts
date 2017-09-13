import { Case, EtatCase } from './Case';
import { Mot } from './Mot'

export class CasePleine extends Case {

    private mot:Mot;

    constructor(x: number, y: number, mot:Mot) {

        super(x, y, EtatCase.pleine);

        this.mot = mot;        
        
    }
    
}