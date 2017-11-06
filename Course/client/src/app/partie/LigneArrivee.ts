
import * as THREE from 'three';
import { Voiture } from '../voiture/Voiture';

export class LigneArrivee {
    private vecteurDebut: THREE.Vector3;
    private vecteurFin: THREE.Vector3;

    constructor(vecteurDebut: THREE.Vector3, vecteurFin: THREE.Vector3) {
        this.vecteurDebut = vecteurDebut;
        this.vecteurFin = vecteurFin;
    }

    public aFranchitLigne(voiture: Voiture): boolean {
        const pointMilieu: THREE.Vector3 = voiture.obtenirPointMilieu();

        if ( this.correspondPositionX(pointMilieu.x) &&
             this.correspondPositionY(pointMilieu.y) ) {
                return true;
        }

        return false;
    }

    public correspondPositionX(position: number): boolean {
        return ( position > this.vecteurDebut.x && position < this.vecteurFin.x ) ? true : false;
    }

    public correspondPositionY(position: number): boolean {
        return ( position > this.vecteurDebut.y && position < this.vecteurFin.y ) ? true : false;
    }
}
