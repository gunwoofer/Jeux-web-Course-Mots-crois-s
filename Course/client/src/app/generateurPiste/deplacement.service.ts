import { Injectable } from '@angular/core';
import { AVANCER, GAUCHE, DROITE, ROTATION, ACCELERATION, DECELERATION, VITESSE_MIN, VITESSE_MAX,
    VITESSE_MODE_ACCELERATEUR, DUREE_ACCELERATEUR, NOMBRE_SECOUSSES_NID_DE_POULE } from './../constant';

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
        if (voiture.modeAquaplannage) {
            this.effetAquaplannage(voiture, voiture.coteAleatoireAquaplannage);
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
            voiture.vitesse = 0;
        }
    }

    private tournerGauche(voiture: Voiture): void {
        voiture.voiture3D.rotateY(ROTATION);
    }

    private tournerDroite(voiture: Voiture): void {
        voiture.voiture3D.rotateY(-ROTATION);
    }

    private effetAquaplannage(voiture: Voiture, coteAleatoire: number): void {
        voiture.voiture3D.position.x += voiture.vecteurVoiture.x * voiture.vitesse;
        voiture.voiture3D.position.y += voiture.vecteurVoiture.y * voiture.vitesse;
        voiture.voiture3D.rotateY(voiture.vitesse * - coteAleatoire * 0.10);
    }

    public reduireVitesseSortiePiste(voiture: Voiture): void {
        voiture.vitesse /= REDUCTION_VITESSE_SORTIE_PISTE;
    }

    public reduireVitesseNidDePoule(voiture: Voiture): void {
        voiture.vitesse /= REDUCTION_VITESSE_NID_DE_POULE;
    }

    public secousseNidDePoule(voiture: Voiture): void {
        voiture.modeSecousse = true;
        for (let i = 0; i < NOMBRE_SECOUSSES_NID_DE_POULE; i++) {
            setTimeout(() => {
                this.secousseAlternative(i, voiture);
            }, i * 100);
        }
        setTimeout(() => {
            voiture.modeSecousse = false;
        }, NOMBRE_SECOUSSES_NID_DE_POULE * 100);
    }

    private secousseAlternative(i: number, voiture: Voiture): void {
        if (i % 2 === 0) {
            voiture.obtenirVoiture3D().rotateX(0.2);
        } else {
            voiture.obtenirVoiture3D().rotateX(-0.2);
        }
    }

    public augmenterVitesseAccelerateur(voiture: Voiture): void {
        voiture.modeAccelerateur = true;
        setTimeout(() => {
            voiture.modeAccelerateur = false;
            voiture.vitesse = VITESSE_MAX;
        }, DUREE_ACCELERATEUR);
    }

    public aquaPlannageFlaqueDEau(voiture: Voiture, vecteurVoiture: THREE.Vector3): void {
        voiture.vecteurVoiture = vecteurVoiture.normalize();
        voiture.coteAleatoireAquaplannage = (Math.random() < 0.5) ? -1 : 1;
        voiture.modeAquaplannage = true;
        setTimeout(() => {
            voiture.modeAquaplannage = false;
        }, 200);
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
