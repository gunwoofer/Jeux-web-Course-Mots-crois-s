import { AVANCER, GAUCHE, DROITE, ROTATION, ACCELERATION, DECELERATION, VITESSE_MIN, VITESSE_MAX } from './../constant';

import { Voiture } from './../voiture/Voiture';

export class Deplacement {
    public enAvant: boolean;
    public aDroite: boolean;
    public aGauche: boolean;

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
        if (this.aDroite && voiture.vitesse > VITESSE_MIN) {
            this.tournerDroite(voiture);
        }
        if (this.aGauche && voiture.vitesse > VITESSE_MIN) {
            this.tournerGauche(voiture);
        }
        voiture.calculerDistance();
    }

    private avancer(voiture: Voiture): void {
        if (voiture.vitesse < VITESSE_MAX) {
            voiture.vitesse += ACCELERATION;
            voiture.voiture3D.translateX(voiture.vitesse);
        } else {
            voiture.voiture3D.translateX(VITESSE_MAX);
        }
    }

    private freiner(voiture: Voiture): void {
        if (voiture.vitesse >= 0 + DECELERATION) {
            voiture.vitesse -= DECELERATION;
            voiture.voiture3D.translateX(voiture.vitesse);
        } else {
            voiture.vitesse = 0;
        }
    }

    private tournerGauche(voiture: Voiture): void {
        voiture.voiture3D.rotateY(ROTATION);
    }

    private tournerDroite(voiture: Voiture): void {
        voiture.voiture3D.rotateY(-ROTATION);
    }

    public touchePesee(event): void {
        if (event.key === AVANCER) { this.enAvant = true; }
        if (event.key === GAUCHE) { this.aGauche = true; }
        if (event.key === DROITE) { this.aDroite = true; }
    }

    public toucheRelachee(event): void {
        if (event.key === AVANCER) { this.enAvant = false; }
        if (event.key === DROITE) { this.aDroite = false; }
        if (event.key === GAUCHE) { this.aGauche = false; }
    }
}
