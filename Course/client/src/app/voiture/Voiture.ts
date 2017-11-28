import { MoteurAutonome } from './moteurAutonome';
import { Piste } from './../piste/piste.model';
import { REDUCTION_VITESSE, VITESSE_INTIALE, ROTATION } from './../constant';

import * as THREE from 'three';
import * as observateur from '../../../../commun/observateur/Observateur';
import * as sujet from '../../../../commun/observateur/Sujet';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { Scene, Vector3 } from 'three';

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
    private listePositions: THREE.Vector3[];
    private moteurAutonome: MoteurAutonome;


    constructor(voiture3D: THREE.Object3D, listePositions: THREE.Vector3[], observateurs?: observateur.Observateur[]) {
        this.voiture3D = voiture3D;
        this.x = this.voiture3D.position.x;
        this.y = this.voiture3D.position.y;
        this.observateurs = (observateurs !== undefined) ? observateurs : [];
        this.vitesse = VITESSE_INTIALE;
        this.listePositions = listePositions;
        this.moteurAutonome = new MoteurAutonome(this.listePositions, this.voiture3D);
    }

    public ajouterIndicateursVoitureScene(scene: THREE.Scene): void {
        this.moteurAutonome.creerIndicateurDevant(scene);
        this.moteurAutonome.creerIndicateurDirection(scene, this.listePositions);
    }

    public modeAutonome(): void {
        this.moteurAutonome.dirigerVoiture(this.listePositions);
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

    public reduireVitesseSortiePiste(): void {
        this.vitesse /= REDUCTION_VITESSE;
    }
}
