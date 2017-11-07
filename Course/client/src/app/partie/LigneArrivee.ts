
import * as THREE from 'three';
import { Voiture } from '../voiture/Voiture';
export const DISTANCE_RAISONNABLE_PRES_LIGNE_ARRIVEE = 10;

export class LigneArrivee {
    private vecteurDebut: THREE.Vector3;
    private vecteurFin: THREE.Vector3;

    constructor(vecteurDebut: THREE.Vector3, vecteurFin: THREE.Vector3) {
        this.vecteurDebut = vecteurDebut;
        this.vecteurFin = vecteurFin;
    }

    private mockLigneArrivee() {

        this.vecteurDebut = new THREE.Vector3(0, 0, 0);
        this.vecteurFin = new THREE.Vector3(10, 0, 0);

    }

    public aFranchitLigne(voiture: Voiture): boolean {
        const pointMilieu: THREE.Vector3 = voiture.obtenirPointMilieu();

        console.log('DEBUT X: ' + this.vecteurDebut.x + ' | X courant: ' + pointMilieu.x + ' | FIN X:' + this.vecteurFin.x);
        console.log('DEBUT Y: ' + this.vecteurDebut.y + ' | Y courant: ' + pointMilieu.y + ' | FIN Y:' + this.vecteurFin.y);

        if ( this.estSurLaLigneArrivee(this.vecteurDebut.x, this.vecteurDebut.y, this.vecteurFin.x,
            this.vecteurFin.y, pointMilieu.x, pointMilieu.y) ) {
                return true;
        }

        return false;
    }

    // Si le produit vectoriel est = 0, alors il est aligné avec la ligne.
    public estSurLaLigneArrivee(p1X: number, p1Y: number, p2X: number, p2Y: number, pMilieuX: number, pMilieuY: number) {

        console.log('CALCUL PRODUITVECTO:' + this.calculDistanceSegmentAPoint(p1X, p1Y, p2X, p2Y, pMilieuX, pMilieuY));

        if (this.calculDistanceSegmentAPoint(p1X, p1Y, p2X, p2Y, pMilieuX, pMilieuY) < DISTANCE_RAISONNABLE_PRES_LIGNE_ARRIVEE) {
            return true;
        }
        return false;
    }

    public calculDistanceSegmentAPoint(p1x: number, p1y: number, p2x: number, p2y: number, vx: number, vy: number): number {
        // Trouver AB
        const abx: number = p1x - p2x;
        const aby: number = p1y - p2y;

        // Trouver AV
        const avx: number =  vx - p1x;
        const avy: number = vy - p1y;

        // Produit vectoriel AV ^ AB
        const avabx: number = avx * aby - avy * abx;
        const avaby: number = avy * abx - avx * aby;

        // NORME AV ^ AB
        const avabnorme: number = Math.pow(Math.pow(avabx ,2) + Math.pow(avaby ,2), 0.5);

        return avabnorme;
    }

    public correspondPositionX(position: number): boolean {
        return ( position > this.vecteurDebut.x && position < this.vecteurFin.x ) ? true : false;
    }

    public correspondPositionY(position: number): boolean {
        return ( position > this.vecteurDebut.y && position < this.vecteurFin.y ) ? true : false;
    }
}
