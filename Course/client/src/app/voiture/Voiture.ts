
import * as THREE from 'three';
import * as observateur from '../../../../commun/observateur/Observateur';
import * as sujet from '../../../../commun/observateur/Sujet';

export class Voiture implements sujet.Sujet {
    private voiture3D: THREE.Object3D;
    public vitesse = 0;
    private x: number;
    private y: number;
    private xPrecedent: number;
    private yPrecedemt: number;
    private longueur: number;
    private largeur: number;
    private pointMilieu: THREE.Vector3;
    public observateurs: observateur.Observateur[] = [];
    public vueDessusTroisieme = false;
    public distanceParcouru = 0;

    constructor(voiture3D: THREE.Object3D, observateurs?: observateur.Observateur[]) {
        this.voiture3D = voiture3D;
        this.x = this.voiture3D.position.x;
        this.y = this.voiture3D.position.y;
        this.observateurs = (observateurs !== undefined) ? observateurs : [];
    }

    public bougerVoiture(x?: number, y?): void {
        this.xPrecedent = this.x;
        this.yPrecedemt = this.y;
        this.x = (x !== undefined) ? x : this.x;
        this.y = (y !== undefined) ? y : this.y;
        this.pointMilieu = this.voiture3D.position;

        const distanceParcourueCourante: number = this.distanceEntreDeuxPoints(this.x, this.y, this.xPrecedent, this.yPrecedemt);

        this.distanceParcouru += distanceParcourueCourante;
        this.notifierObservateurs();
    }

    public obtenirCoordonneesPrecedent(): THREE.Vector2 {
        const vectPrecedant = new THREE.Vector2(this.xPrecedent, this.yPrecedemt);
        return vectPrecedant;
    }

    public distanceEntreDeuxPoints(x1: number, y1: number, x2: number, y2: number): number {
        return Math.pow( Math.pow((x1 - x2), 2) + Math.pow( (y1 - y2), 2), 0.5);
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
            observateurCourant.notifier(this);
        }
    }
}
