import { Injectable } from '@angular/core';
import { AVANCER, GAUCHE, DROITE, ROTATION, ACCELERATION, DECELERATION, VITESSE_MIN, VITESSE_MAX, VITESSE_INTIALE,
    VITESSE_MODE_ACCELERATEUR, DUREE_ACCELERATEUR, NOMBRE_SECOUSSES_NID_DE_POULE } from './../constant';

import { Voiture, REDUCTION_VITESSE_SORTIE_PISTE, REDUCTION_VITESSE_NID_DE_POULE } from './../voiture/Voiture';

const SECOUSSE_X = 0.2;
const TEMPS_AQUA_PLANNAGE = 200;

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

    private static effetAquaplannage(voiture: Voiture, coteAleatoire: number): void {
        voiture.voiture3D.position.x += voiture.vecteurVoiture.x * voiture.vitesse;
        voiture.voiture3D.position.y += voiture.vecteurVoiture.y * voiture.vitesse;
        voiture.voiture3D.rotateY(voiture.vitesse * - coteAleatoire * 0.10);
    }

    public static reduireVitesseSortiePiste(voiture: Voiture): void {
        voiture.vitesse /= REDUCTION_VITESSE_SORTIE_PISTE;
    }

    public static reduireVitesseNidDePoule(voiture: Voiture): void {
        voiture.vitesse /= REDUCTION_VITESSE_NID_DE_POULE;
    }

    public static secousseNidDePoule(voiture: Voiture): void {
        voiture.modeSecousse = true;
        for (let secousse = 0; secousse < NOMBRE_SECOUSSES_NID_DE_POULE; secousse++) {
            setTimeout(() => {
                this.secousseAlternative(secousse, voiture);
            }, secousse * 100);
        }
        setTimeout(() => {
            voiture.modeSecousse = false;
        }, NOMBRE_SECOUSSES_NID_DE_POULE * 100);
    }

    private static secousseAlternative(secousse: number, voiture: Voiture): void {
        if (secousse % 2 === 0) {
            voiture.obtenirVoiture3D().rotateX(SECOUSSE_X);
        } else {
            voiture.obtenirVoiture3D().rotateX(-SECOUSSE_X);
        }
    }

    public static augmenterVitesseAccelerateur(voiture: Voiture): void {
        voiture.modeAccelerateur = true;
        setTimeout(() => {
            voiture.modeAccelerateur = false;
            voiture.vitesse = VITESSE_MAX;
        }, DUREE_ACCELERATEUR);
    }

    public static aquaPlannageFlaqueDEau(voiture: Voiture, vecteurVoiture: THREE.Vector3): void {
        voiture.vecteurVoiture = vecteurVoiture.normalize();
        voiture.coteAleatoireAquaplannage = (Math.random() < 0.5) ? -1 : 1;
        voiture.modeAquaplannage = true;
        setTimeout(() => {
            voiture.modeAquaplannage = false;
        }, TEMPS_AQUA_PLANNAGE);
    }

    public moteurDeplacement(voiture: Voiture): void {
        if (voiture.modeAquaplannage) {
            DeplacementService.effetAquaplannage(voiture, voiture.coteAleatoireAquaplannage);
        } else {
            if (this.enAvant || voiture.modeAccelerateur) {
                this.avancer(voiture);
            } else if (!voiture.modeAquaplannage) {
                this.freiner(voiture);
            }
            if ((this.aDroite && voiture.vitesse > VITESSE_MIN) && !voiture.modeSecousse) {
                this.tournerDroite(voiture);
            }
            if ((this.aGauche && voiture.vitesse > VITESSE_MIN) && !voiture.modeSecousse) {
                this.tournerGauche(voiture);
        }
        }
        voiture.calculerDistance();
    }

    private avancer(voiture: Voiture): void {
        if (voiture.modeAccelerateur) {
            voiture.voiture3D.translateX(VITESSE_MODE_ACCELERATEUR);
        } else {
            if (voiture.vitesse < VITESSE_MAX) {
                voiture.vitesse += ACCELERATION;
                voiture.voiture3D.translateX(voiture.vitesse);
            } else {
                voiture.voiture3D.translateX(VITESSE_MAX);
            }
        }
    }

    private freiner(voiture: Voiture): void {
        if (voiture.vitesse >= 0 + DECELERATION) {
            voiture.vitesse -= DECELERATION;
            voiture.voiture3D.translateX(voiture.vitesse);
        } else {
            voiture.vitesse = VITESSE_INTIALE;
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
