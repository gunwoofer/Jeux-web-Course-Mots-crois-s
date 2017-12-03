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

export class Voiture implements sujet.Sujet {
    public voiture3D: THREE.Object3D;
    public vitesse;
    private x: number;
    private y: number;
    private xPrecedent: number;
    private yPrecedemt: number;
    private pointMilieu: THREE.Vector3;
    public observateurs: observateur.Observateur[] = [];
    public vueDessusTroisieme = false;
    public distanceParcouru = 0;
    public modeAccelerateur = false;
    public modeSecousse = false;
    public modeAquaplannage = false;
    public vecteurVoiture: THREE.Vector3;
    public coteAleatoireAquaplannage: number;
    private listePositions: THREE.Vector3[];
    private moteurAutonome: MoteurAutonome;
    public raycasterCollisionDroit = new THREE.Raycaster;
    public raycasterCollisionGauche = new THREE.Raycaster;
    public guid: string;


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

    constructor(voiture3D: THREE.Object3D, piste: Piste, observateurs?: observateur.Observateur[]) {
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
            positionAvant.setFromMatrixPosition(
                                    this.voiture3D.getObjectByName('Phare Droit').matrixWorld);
            break;
            case true:
             positionAvant.setFromMatrixPosition(

            this.voiture3D.getObjectByName('Phare Gauche').matrixWorld);
            break;
        }
        return new THREE.Vector3(positionAvant.x, positionAvant.y, positionAvant.z + 1);
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

    public obtenirRoueAvantGauche(): THREE.Object3D {
        return this.voiture3D.children[21];
    }

    public obtenirRoueAvantDroite(): THREE.Object3D {
        return this.voiture3D.children[25];
    }

    public calculerDistance(): void {
        this.xPrecedent = this.x;
        this.yPrecedemt = this.y;
        this.x = this.obtenirVoiture3D().position.x;
        this.y = this.obtenirVoiture3D().position.y;
        this.pointMilieu = this.voiture3D.position;

        const distanceParcourueCourante: number = this.distanceEntreDeuxPoints(this.x, this.y, this.xPrecedent, this.yPrecedemt);

        this.distanceParcouru += distanceParcourueCourante;
        this.notifierObservateurs();
    }

    public ignorerSortiepiste(): void {
        this.xPrecedent = this.obtenirVoiture3D().position.x;
        this.yPrecedemt = this.obtenirVoiture3D().position.y;
        this.x = this.obtenirVoiture3D().position.x;
        this.y = this.obtenirVoiture3D().position.y;
    }

    public obtenirCoordonneesPrecedent(): THREE.Vector2 {
        const vectPrecedant = new THREE.Vector2(this.xPrecedent, this.yPrecedemt);
        return vectPrecedant;
    }

    public distanceEntreDeuxPoints(x1: number, y1: number, x2: number, y2: number): number {
        return Math.pow(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2), 0.5);
    }

    public obtenirVoiture3D(): THREE.Object3D {
        return this.voiture3D;
    }


    public obtenirPointMilieu(): THREE.Vector3 {
        return this.pointMilieu;
    }

    public ajouterObservateur(observateur: observateur.Observateur): void {
        this.observateurs.push(observateur);
    }

    public supprimerObservateur(observateur: observateur.Observateur): void {
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
