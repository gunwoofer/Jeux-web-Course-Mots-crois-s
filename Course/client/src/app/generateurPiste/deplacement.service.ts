import { Injectable } from '@angular/core';
import { AVANCER, GAUCHE, DROITE, ROTATION, ACCELERATION, DECELERATION, VITESSE_MIN, VITESSE_MAX } from './../constant';

import { Voiture, REDUCTION_VITESSE_SORTIE_PISTE, REDUCTION_VITESSE_NID_DE_POULE } from './../voiture/Voiture';

@Injectable()
export class DeplacementService {
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

    public reduireVitesseSortiePiste(voiture: Voiture): void {
        voiture.vitesse /= REDUCTION_VITESSE_SORTIE_PISTE;
    }

    public reduireVitesseNidDePoule(voiture: Voiture): void {
        voiture.vitesse /= REDUCTION_VITESSE_NID_DE_POULE;
    }

    public secousseNidDePoule(): void {
        return;
    }

    public augmenterVitesseAccelerateur(voiture: Voiture): void {
        voiture.vitesse = 1;
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
