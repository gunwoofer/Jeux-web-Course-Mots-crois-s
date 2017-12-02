import { Voiture, REDUCTION_VITESSE_SORTIE_PISTE, REDUCTION_VITESSE_NID_DE_POULE } from '../voiture/Voiture';
import {    NOMBRE_SECOUSSES_NID_DE_POULE, DUREE_ACCELERATEUR, VITESSE_MAX, VITESSE_MODE_ACCELERATEUR,
            ACCELERATION, DECELERATION, VITESSE_INTIALE, ROTATION } from '../constant';

const SECOUSSE_X = 0.2;
const TEMPS_AQUA_PLANNAGE = 200;

export class DeplacementVoiture {

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

    public static effetAquaplannage(voiture: Voiture, coteAleatoire: number): void {
        voiture.voiture3D.position.x += voiture.vecteurVoiture.x * voiture.vitesse;
        voiture.voiture3D.position.y += voiture.vecteurVoiture.y * voiture.vitesse;
        voiture.voiture3D.rotateY(voiture.vitesse * - coteAleatoire * 0.10);
    }

    public static avancer(voiture: Voiture): void {
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

    public static freiner(voiture: Voiture): void {
        if (voiture.vitesse >= 0 + DECELERATION) {
            voiture.vitesse -= DECELERATION;
            voiture.voiture3D.translateX(voiture.vitesse);
        } else {
            voiture.vitesse = VITESSE_INTIALE;
        }
    }

    public static tournerGauche(voiture: Voiture): void {
        voiture.voiture3D.rotateY(ROTATION);
    }

    public static tournerDroite(voiture: Voiture): void {
        voiture.voiture3D.rotateY(-ROTATION);
    }

    private static secousseAlternative(secousse: number, voiture: Voiture): void {
        if (secousse % 2 === 0) {
            voiture.obtenirVoiture3D().rotateX(SECOUSSE_X);
        } else {
            voiture.obtenirVoiture3D().rotateX(-SECOUSSE_X);
        }
    }
}
