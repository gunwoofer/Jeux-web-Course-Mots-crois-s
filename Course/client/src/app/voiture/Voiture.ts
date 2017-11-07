
import * as THREE from 'three';
import * as observateur from '../../../../commun/observateur/Observateur';
import * as sujet from '../../../../commun/observateur/Sujet';

export class Voiture implements sujet.Sujet {
    private voiture3D: THREE.Object3D;
    public vitesse = 0;
    private x: number;
    private y: number;
    private z: number;
    private longueur: number;
    private largeur: number;
    private pointMilieu: THREE.Vector3;
    public observateurs: observateur.Observateur[] = [];
    public vueDessusTroisieme = false;

    constructor(voiture3D: THREE.Object3D, observateurs?: observateur.Observateur[]) {
        this.voiture3D = voiture3D;
        this.x = this.voiture3D.position.x;
        this.y = this.voiture3D.position.y;
        this.z = this.voiture3D.position.z;
        this.observateurs = (observateurs !== undefined) ? observateurs : [];
    }

    public bougerVoiture(x?: number, y?: number, z?: number) {
        this.x = (x !== undefined) ? x : this.x;
        this.y = (y !== undefined) ? y : this.y;
        this.z = (z !== undefined) ? z : this.z;

        this.mettreAJourPosiitonVoiture3D(x, y, z);
    }

    private mettreAJourPosiitonVoiture3D(x?: number, y?: number, z?: number) {
        this.voiture3D.position.x = (x !== undefined) ? x : this.x;
        this.voiture3D.position.y = (y !== undefined) ? y : this.y;
        this.voiture3D.position.z = (z !== undefined) ? z : this.z;
        this.pointMilieu = this.voiture3D.position;
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

    public notifierObservateurs(): void {
        for (const observateurCourant of this.observateurs) {
            observateurCourant.notifier(this);
        }
    }
}
