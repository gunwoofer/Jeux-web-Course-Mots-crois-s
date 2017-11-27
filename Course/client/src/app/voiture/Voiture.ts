import { Piste } from './../piste/piste.model';
import { REDUCTION_VITESSE, VITESSE_INTIALE, ROTATION } from './../constant';

import * as THREE from 'three';
import * as observateur from '../../../../commun/observateur/Observateur';
import * as sujet from '../../../../commun/observateur/Sujet';
import { NotificationType } from '../../../../commun/observateur/NotificationType';

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
    public pointDestination: THREE.Vector3;
    public vecteurDirectionVoitureDestination: THREE.Vector3;
    public piste: any;
    public entierI = 0;

    public miseAjourPointDestination(positionDestination: THREE.Vector3): void {
        this.pointDestination = positionDestination;
        //this.voiture3D.position.add(new THREE.Vector3(-10,-10,-20));
    }
    public miseAjourvecteurDirectionVoitureDestination(): void {
        const positionVoitureNegatif = new THREE.Vector3().set(-this.voiture3D.position.x, -this.voiture3D.position.y, 0);
        this.vecteurDirectionVoitureDestination =  new THREE.Vector3().copy(this.pointDestination).add(positionVoitureNegatif);
        // console.log("positionVoiture", this.voiture3D.position, "pointDestination", this.pointDestination, "difference", this.vecteurDirectionVoitureDestination)
        this.vecteurDirectionVoitureDestination.normalize();
    }

    public obtenirSensRotation(): number {
        // return Math.sign(this.ecartDirection());
      if (this.entierI > 20) {

        console.log(new THREE.Vector3().copy(this.voiture3D.getWorldDirection()).cross(this.vecteurDirectionVoitureDestination));
        console.log(this.pointDestination, this.piste.listepositions[2] );
      }
        return Math.sign(this.voiture3D.getWorldDirection().cross(this.vecteurDirectionVoitureDestination).z);
    }

    public faireAvancerVoiture(): void {
        // this.voiture3D.translateX(this.vitesse);
        this.voiture3D.translateX(0.1);
    }

    public faireTournerVoiture(): void {
        this.voiture3D.rotateY(- ROTATION * this.obtenirSensRotation());
    }

    public ecartDirection(): number {
        // return this.voiture3D.getWorldDirection().cross(this.vecteurDirectionVoitureDestination).y;
        const vecteurDirectionVoitureDestinationInverse = new THREE.Vector3().copy(this.vecteurDirectionVoitureDestination).negate();
        const differenceVecteurDirectionEtDestination = this.voiture3D.getWorldDirection().add(vecteurDirectionVoitureDestinationInverse);
        // return differenceVecteurDirectionEtDestination.dot(differenceVecteurDirectionEtDestination);
      return this.vecteurDirectionVoitureDestination.distanceTo( this.voiture3D.getWorldDirection());
    }

    public actualiserPositionVoiture(): void {
//        public actualiserPositionVoiture(piste: Piste): void {
        // this.miseAjourPointDestination(piste.listepositions[0]);

        this.miseAjourvecteurDirectionVoitureDestination();
        if (this.ecartDirection() > 0.2) {
            this.faireTournerVoiture();
          if (this.voiture3D.position.distanceTo(this.pointDestination) < 10) {
            console.log("MAJ point destination");
            this.miseAjourPointDestination(this.piste.listepositions[2]);
          }
        }
      this.faireAvancerVoiture();
        this.entierI++;
        if (this.entierI > 21){
          console.log(this.vecteurDirectionVoitureDestination, this.voiture3D.getWorldDirection(), this.ecartDirection(), this.obtenirSensRotation());
          this.entierI=0;
        }

    }


    constructor(voiture3D: THREE.Object3D, observateurs?: observateur.Observateur[]) {
        this.voiture3D = voiture3D;
        this.x = this.voiture3D.position.x;
        this.y = this.voiture3D.position.y;
        this.observateurs = (observateurs !== undefined) ? observateurs : [];
        this.vitesse = VITESSE_INTIALE;
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
