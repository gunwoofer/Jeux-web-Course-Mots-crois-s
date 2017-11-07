import { Voiture } from './../voiture/Voiture';
import * as THREE from 'three';

const avancer = 'w';
const reculer = 's';
const gauche = 'a';
const droite = 'd';
const changerVue = 'c';
const rotation = 0.1;

export class Deplacement {
    private touchePressee: string[] = new Array(3);
    private enAvant: boolean;
    private aDroite: boolean;
    private aGauche: boolean;

    /*
    constructor() {
        this.enAvant = false;
        this.aGauche = false;
        this.aDroite = false;
    }
    */

    public deplacementVoiture(event, voiture: Voiture): void {
        /*
        if (event.key === avancer) {
            console.log('TOUCHE AVANCER APPUYEE');
            this.enAvant = true;
        }
        if (event.key === avancer && this.enAvant) {
            console.log('tourne à gauche !');
            this.aGauche = true;
        }
        if (event.key === droite && this.enAvant) {
            console.log('tourne à droite !');
            this.aDroite = true;
        }
        */
    }

    public toucheRelachee(event): void {
        if (event.key === avancer) {
            this.enAvant = false;
        }
        if (event.key === droite) {
            this.aDroite = false;
        }
        if (event.key === gauche) {
            this.aGauche = false;
        }
    }

    private avancer(voiture: Voiture): void {
        voiture.voiture3D.translateX(voiture.vitesse);
        console.log(voiture.vitesse);
        /*
        this.touchePressee[0] = avancer;
        this.touchePressee[1] = this.touchePressee[1];
        if (this.touchePressee[1] === gauche) {
            voiture3D.rotateY(0.01);
            this.touchePressee[1] = this.touchePressee[0];
            this.touchePressee[0] = gauche;
            event.keyCode = gauche;
        }
        if (this.touchePressee[1] === droite) {
            voiture3D.rotateY(-0.01);
            this.touchePressee[1] = this.touchePressee[0];
            this.touchePressee[0] = droite;
        }
        */
    }

    private tournerGauche(voiture: Voiture): void {
        // this.touchePressee[1] = this.touchePressee[0];
        // this.touchePressee[0] = gauche ;
        voiture.voiture3D.rotateY(rotation);
        /*
        if (this.touchePressee[1] === avancer) {
            voiture3D.translateX(1);
            this.touchePressee[1] = this.touchePressee[0];
            this.touchePressee[0] = avancer;
        }
        */
    }

    private tournerDroite(voiture: Voiture): void {
        // this.touchePressee[1] = this.touchePressee[0];
        // this.touchePressee[0] = droite;
        voiture.voiture3D.rotateY(-rotation);
        /*
        if (this.touchePressee[1] === avancer) {
            voiture3D.translateX(1);
            this.touchePressee[1] = this.touchePressee[0];
            this.touchePressee[0] = avancer;
        }
        */
    }

    public touchePesee(event): void {
        if (event.key === avancer) {
            this.enAvant = true;
        }
        if (event.key === gauche && this.enAvant) {
            this.aGauche = true;
        }
        if (event.key === droite && this.enAvant) {
            this.aDroite = true;
        }
    }

    public moteurDeplacement(voiture: Voiture): void {
        voiture.vitesse += 0.0005;
        if (this.enAvant) {
            this.avancer(voiture);
        }
        if (this.aDroite) {
            this.tournerDroite(voiture);
        }
        if (this.aGauche) {
            this.tournerGauche(voiture);
        }
    }
}
