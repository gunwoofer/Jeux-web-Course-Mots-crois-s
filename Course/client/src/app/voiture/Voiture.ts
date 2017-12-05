import { FonctionMaths } from './../fonctionMathematiques';
import { MoteurAutonome } from './moteurAutonome';
import { Piste } from './../piste/piste.model';
import { Guid } from './../../../../commun/Guid';
import { VITESSE_INTIALE, VOITURE_VECTEUR_AVANT_GAUCHE, VOITURE_VECTEUR_ARRIERE_GAUCHE } from './../constant';

import * as THREE from 'three';
import * as observateur from '../../../../commun/observateur/Observateur';
import * as sujet from '../../../../commun/observateur/Sujet';
import { NotificationType } from '../../../../commun/observateur/NotificationType';

export const REDUCTION_VITESSE_SORTIE_PISTE = 10;
export const REDUCTION_VITESSE_NID_DE_POULE = 4;
const vecVersLeBas = new THREE.Vector3(0, 0, -1);

export class Voiture implements sujet.ISujet {

    public voiture3D: THREE.Object3D;
    public vitesse;
    public observateurs: observateur.IObservateur[] = [];
    public vueDessusTroisieme = false;
    public distanceParcouru = 0;
    public modeAccelerateur = false;
    public modeSecousse = false;
    public modeAquaplannage = false;
    public vecteurVoiture: THREE.Vector3;
    public coteAleatoireAquaplannage: number;
    public raycasterCollisionDroit = new THREE.Raycaster;
    public raycasterCollisionGauche = new THREE.Raycaster;
    public guid: string;

    private x: number;
    private y: number;
    private xPrecedent: number;
    private yPrecedemt: number;
    private listePositions: THREE.Vector3[];
    private moteurAutonome: MoteurAutonome;

    public static vecteurVoiture(voiture: Voiture): THREE.Vector3 {
        return new THREE.Vector3(
            this.obtenirMilieuVoitureX(this.vecteurAvantGauche(voiture), this.vecteurArriereGauche(voiture)),
            this.obtenirMilieuVoitureY(this.vecteurAvantGauche(voiture), this.vecteurArriereGauche(voiture))
        );
    }

    private static vecteurAvantGauche(voiture: Voiture): THREE.Vector3 {
        return new THREE.Vector3()
            .setFromMatrixPosition(voiture.voiture3D.children[VOITURE_VECTEUR_AVANT_GAUCHE].matrixWorld);
    }

    private static vecteurArriereGauche(voiture: Voiture): THREE.Vector3 {
        return new THREE.Vector3()
            .setFromMatrixPosition(voiture.voiture3D.children[VOITURE_VECTEUR_ARRIERE_GAUCHE].matrixWorld);
    }

    private static obtenirMilieuVoitureX(vecteurAvantGauche: THREE.Vector3, vecteurArriereGauche: THREE.Vector3): number {
        return vecteurAvantGauche.x - vecteurArriereGauche.x;
    }

    private static obtenirMilieuVoitureY(vecteurAvantGauche: THREE.Vector3, vecteurArriereGauche: THREE.Vector3): number {
        return vecteurAvantGauche.y - vecteurArriereGauche.y;
    }

    constructor(voiture3D: THREE.Object3D, piste: Piste, observateurs?: observateur.IObservateur[]) {
        this.voiture3D = voiture3D;
        this.x = this.voiture3D.position.x;
        this.y = this.voiture3D.position.y;
        this.observateurs = (observateurs !== undefined) ? observateurs : [];
        this.vitesse = VITESSE_INTIALE;
        this.listePositions = piste.listepositions;
        this.moteurAutonome = new MoteurAutonome(this.listePositions, this.voiture3D, piste.typeCourse);
        this.guid = Guid.generateGUID();
        this.genererRayCasterCollision();
    }

    public ajouterIndicateursVoitureScene(scene: THREE.Scene): void {
        this.moteurAutonome.creerIndicateurDevant(scene);
        this.moteurAutonome.creerIndicateurDirection(scene, this.listePositions);
    }

    public obtenirPositionDevantVoiture(droitFalseGaucheTrue: boolean): THREE.Vector3 {
        const positionAvant = new THREE.Vector3();
        switch (droitFalseGaucheTrue) {
            case false:
                positionAvant.setFromMatrixPosition(this.voiture3D.getObjectByName('Phare Droit').matrixWorld);
                break;
            case true:
                positionAvant.setFromMatrixPosition(this.voiture3D.getObjectByName('Phare Gauche').matrixWorld);
                break;
        }
        positionAvant.z += 1;
        return positionAvant;
    }

    public peutObtenirObjetVoiture(): boolean {
        return (this.voiture3D.getObjectByName('Phare Gauche') === undefined ||
                this.voiture3D.getObjectByName('Phare Droit') === undefined) ? false : true;
    }

    public obtenirDirectionVoitureNormalisee(): THREE.Vector3 {
        return new THREE.Vector3()
        .subVectors(this.voiture3D.localToWorld(new THREE.Vector3(1, 0, 0)), this.voiture3D.position).normalize();
    }

    public genererRayCasterCollision(): void {
        if (this.peutObtenirObjetVoiture()) {
            this.raycasterCollisionDroit = new THREE.Raycaster(this.obtenirPositionDevantVoiture(false), vecVersLeBas);
            this.raycasterCollisionGauche = new THREE.Raycaster(this.obtenirPositionDevantVoiture(true), vecVersLeBas);
        }
    }

    public actualiserPositionRayCasterCollision(): void {
        if (this.peutObtenirObjetVoiture()) {
            this.raycasterCollisionDroit.set(this.obtenirPositionDevantVoiture(false), vecVersLeBas);
            this.raycasterCollisionGauche.set(this.obtenirPositionDevantVoiture(true), vecVersLeBas);
        }
    }

    public reactionVoitureQuiCauseImpact(): void {
        if (this.vitesse > 0.3) {
            this.vitesse -= 0.3;
        }
    }

    public reactionDeVoitureQuiRecoitImpact(voiture: Voiture): void {
        this.voiture3D.position.add
        (new THREE.Vector3().copy(voiture.obtenirDirectionVoitureNormalisee()).multiplyScalar(3 * voiture.vitesse));
    }

    public modeAutonome(): void {
        this.moteurAutonome.dirigerVoiture(this.listePositions);
    }

    public calculerDistance(): void {
        this.xPrecedent = this.x; this.yPrecedemt = this.y;
        this.x = this.obtenirVoiture3D().position.x; this.y = this.obtenirVoiture3D().position.y;
        const distanceParcourueCourante: number = FonctionMaths.distanceEntreDeuxPoints(this.x, this.y, this.xPrecedent, this.yPrecedemt);
        this.distanceParcouru += distanceParcourueCourante;
        this.notifierObservateurs();
    }

    public ignorerSortiepiste(): void {
        this.xPrecedent = this.obtenirVoiture3D().position.x;
        this.yPrecedemt = this.obtenirVoiture3D().position.y;
        this.x = this.obtenirVoiture3D().position.x;
        this.y = this.obtenirVoiture3D().position.y;
    }

    public obtenirVoiture3D(): THREE.Object3D {
        return this.voiture3D;
    }

    public obtenirPosition(): THREE.Vector3 {
        return this.voiture3D.position;
    }

    public ajouterObservateur(observateur: observateur.IObservateur): void {
        this.observateurs.push(observateur);
    }

    public supprimerObservateur(observateur: observateur.IObservateur): void {
        for (let i = 0; i < this.observateurs.length; i++) {
            if (this.observateurs[i] === observateur) {
                this.observateurs.splice(i, 1);
            }
        }
    }

    public supprimerObservateurs(): void {
        this.observateurs = [];
    }

    public notifierObservateurs(): void {
        for (const observateurCourant of this.observateurs) {
            observateurCourant.notifier(this, NotificationType.Non_definie);
        }
    }

}
