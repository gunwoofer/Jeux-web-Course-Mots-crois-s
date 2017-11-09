import { Voiture } from './../voiture/Voiture';
import * as THREE from 'three';

const avancer = 'w';
const gauche = 'a';
const droite = 'd';
const rotation = 0.03;
const acceleration = 0.005;
const deceleration = 0.01;
const vitesseMax = 0.8;
const vitesseMin = 0.05;

export class Deplacement {
    private enAvant: boolean;
    private aDroite: boolean;
    private aGauche: boolean;

    constructor() {
        this.enAvant = false;
        this.aGauche = false;
        this.aDroite = false;
    }

    public moteurDeplacement(voiture: Voiture): void {
        if (this.enAvant) {
            this.avancer(voiture);
        } else {
            this.freiner(voiture);
        }
        if (this.aDroite && voiture.vitesse > vitesseMin) {
            this.tournerDroite(voiture);
        }
        if (this.aGauche && voiture.vitesse > vitesseMin) {
            this.tournerGauche(voiture);
        }
    }

    private avancer(voiture: Voiture): void {
        if (voiture.vitesse < vitesseMax) {
            voiture.vitesse += acceleration;
            voiture.voiture3D.translateX(voiture.vitesse);
        } else {
            voiture.voiture3D.translateX(vitesseMax);
        }
    }

    private freiner(voiture: Voiture): void {
        if (voiture.vitesse >= 0 + deceleration) {
            voiture.vitesse -= deceleration;
            voiture.voiture3D.translateX(voiture.vitesse);
        } else {
            voiture.vitesse = 0;
        }
    }

    private tournerGauche(voiture: Voiture): void {
        voiture.voiture3D.rotateY(rotation);
    }

    private tournerDroite(voiture: Voiture): void {
        voiture.voiture3D.rotateY(-rotation);
    }

    public touchePesee(event): void {
        if (event.key === avancer) {
            this.enAvant = true;
        }
        if (event.key === gauche) {
            this.aGauche = true;
        }
        if (event.key === droite) {
            this.aDroite = true;
        }
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
}
