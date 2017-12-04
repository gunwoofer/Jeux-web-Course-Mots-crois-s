import { Injectable } from '@angular/core';
import { AVANCER, GAUCHE, DROITE, VITESSE_MIN } from './../constant';
import { Voiture } from './../voiture/Voiture';
import { DeplacementVoiture } from './deplacementVoiture';

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

    public moteurDeplacement(voiture: Voiture): void {
        if (voiture.modeAquaplannage) {
            DeplacementVoiture.effetAquaplannage(voiture, voiture.coteAleatoireAquaplannage);
        } else {
            if (this.enAvant || voiture.modeAccelerateur) {
                DeplacementVoiture.avancer(voiture);
            } else if (!voiture.modeAquaplannage) {
                DeplacementVoiture.freiner(voiture);
            }
            if ((this.aDroite && voiture.vitesse > VITESSE_MIN) && !voiture.modeSecousse) {
                DeplacementVoiture.tournerDroite(voiture);
            }
            if ((this.aGauche && voiture.vitesse > VITESSE_MIN) && !voiture.modeSecousse) {
                DeplacementVoiture.tournerGauche(voiture);
            }
        }
        voiture.calculerDistance();
    }
}
