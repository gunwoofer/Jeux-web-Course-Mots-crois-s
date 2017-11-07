import { Voiture } from './../voiture/Voiture';
import * as THREE from 'three';

const avancer = 'w';
const gauche = 'a';
const droite = 'd';
const rotation = 0.05;
const acceleration = 0.001;

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
        voiture.vitesse += acceleration;
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

    private avancer(voiture: Voiture): void {
        voiture.voiture3D.translateX(voiture.vitesse);
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
        if (event.key === gauche && this.enAvant) {
            this.aGauche = true;
        }
        if (event.key === droite && this.enAvant) {
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
