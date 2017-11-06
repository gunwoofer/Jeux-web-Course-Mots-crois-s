
import * as THREE from 'three';
import { Voiture } from '../voiture/Voiture';

export class LigneArrivee {
    private vecteurDebut: THREE.Vector3;
    private vecteurFin: THREE.Vector3;

    constructor(vecteurDebut: THREE.Vector3, vecteurFin: THREE.Vector3) {
        this.vecteurDebut = vecteurDebut;
        this.vecteurFin = vecteurFin;
        this.mockLigneArrivee();
    }

    private mockLigneArrivee() {

        this.vecteurDebut = new THREE.Vector3(0, 0, 0);
        this.vecteurFin = new THREE.Vector3(10, 0, 0);

    }

    public aFranchitLigne(voiture: Voiture): boolean {
        const pointMilieu: THREE.Vector3 = voiture.obtenirPointMilieu();

        if ( this.estSurLaLigneArrivee(this.vecteurDebut.x, this.vecteurDebut.y, this.vecteurFin.x,
            this.vecteurFin.y, pointMilieu.x, pointMilieu.y) ) {
                return true;
        }

        return false;
    }

    // Si le produit vectoriel est = 0, alors il est aligné avec la ligne.
    public estSurLaLigneArrivee(p1X: number, p1Y: number, p2X: number, p2Y: number, pMilieuX: number, pMilieuY: number) {
        if (this.calculDuProduitVectoriel(p1X, p1Y, p2X, p2Y, pMilieuX, pMilieuY) === 0) {
            return true;
        }
        return false;
    }

    public calculDuProduitVectoriel(p1X: number, p1Y: number, p2X: number, p2Y: number, pMilieuX: number, pMilieuY: number): number {
        return ((p2X - p1X) * ( pMilieuY - p1Y) - (pMilieuX - p1X) * (p2Y - p1Y) );
    }

    public correspondPositionX(position: number): boolean {
        return ( position > this.vecteurDebut.x && position < this.vecteurFin.x ) ? true : false;
    }

    public correspondPositionY(position: number): boolean {
        return ( position > this.vecteurDebut.y && position < this.vecteurFin.y ) ? true : false;
    }
}
