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
    private indicateurDirectionDestination: THREE.Mesh;
    private indicateurDevant: THREE.Mesh;
    private cubeDirectionDestination: THREE.Mesh;
    private directionDestination: THREE.Vector3;
    private indiceCubeAAtteindre = 1;
    private directionDevantCube: THREE.Vector3;
    private ANGLEROTATION = 0.01;
    private listePositions: THREE.Vector3[];
    private COEFFICIENT_ACTUALISATION_DIRECTION = 0.99;


    constructor(voiture3D: THREE.Object3D, piste: Piste, observateurs?: observateur.Observateur[]) {
        this.voiture3D = voiture3D;
        this.x = this.voiture3D.position.x;
        this.y = this.voiture3D.position.y;
        this.observateurs = (observateurs !== undefined) ? observateurs : [];
        this.vitesse = VITESSE_INTIALE;
        this.listePositions = piste.listepositions;
        this.directionDevantCube = new THREE.Vector3();
        this.miseAjourDirectionDestination();
    }

    public createCube(position: THREE.Vector3, size: number = 1): THREE.Mesh {
        const geometry = new THREE.BoxGeometry(5 * size, 5 * size, 5 * size);
        geometry.faces[0].color.setHex(Math.random() * 0xffffff);
        const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5, visible: false });
        const cubeRetourne = new THREE.Mesh(geometry, material);
        cubeRetourne.position.set(position.x, position.y, position.z);
        cubeRetourne.rotateX(Math.PI / 2);
        return cubeRetourne;
    }

    public miseAjourDirectionDestination() {
        this.directionDestination = new THREE.Vector3()
            .copy(this.listePositions[this.indiceCubeAAtteindre])
            .add(new THREE.Vector3()
                .copy(this.voiture3D.position)
                .negate()).normalize();
    }

    public creerCubeDevant(scene: THREE.Scene) {
        this.indicateurDevant = this.createCube(new THREE.Vector3().copy(this.voiture3D.position).add(this.directionDestination), 0.5);
        scene.add(this.indicateurDevant);
    }

    public creationIndicateur(scene: THREE.Scene) {
        this.creerCubeDevant(scene);
        this.creerCubeDirection(scene);
    }

    public creerCubeDirection(scene: THREE.Scene) {
        this.cubeDirectionDestination = this.createCube(new THREE.Vector3()
            .copy(this.voiture3D.position)
            .add(this.directionDestination), 0.3);
        this.miseAjourDirectionDestination();
        scene.add(this.cubeDirectionDestination);
    }

    public miseAjourPositionCubeDirectionDestination() {
        const positionIndicDirection = new THREE.Vector3().addVectors(this.voiture3D.position,
            new THREE.Vector3()
                .copy(this.directionDestination)
                .multiplyScalar(50));
        this.cubeDirectionDestination.position.set(positionIndicDirection.x, positionIndicDirection.y, positionIndicDirection.z);
    }

    public miseAjourPositionCubeDevant() {
        const angleOrientationCube = this.voiture3D.getWorldRotation().z;
        const vecteurDirection = new THREE.Vector3()
            .subVectors(this.voiture3D.localToWorld(new THREE.Vector3(1, 0, 0)), this.voiture3D.position).normalize();
        if (new THREE.Vector3().copy(this.directionDevantCube).dot(vecteurDirection) < this.COEFFICIENT_ACTUALISATION_DIRECTION) {
            this.directionDevantCube = new THREE.Vector3().copy(vecteurDirection);
        }
        const positionIndicDeplacement = new THREE.Vector3()
            .copy(this.voiture3D.position)
            .add(vecteurDirection.multiplyScalar(30));
        this.indicateurDevant.position.set(positionIndicDeplacement.x, positionIndicDeplacement.y, positionIndicDeplacement.z);
    }

    private faireTournerVoiture(sens: number) {
        this.voiture3D.rotateY(this.ANGLEROTATION * sens);
    }

    private obtenirSensRotationVoiture(): number { // >0 --> Gauche
        const signeProduitVectoriel = new THREE.Vector3()
            .copy(this.directionDevantCube)
            .cross(new THREE.Vector3()
                .copy(this.directionDestination));
        return Math.sign(signeProduitVectoriel.z);
    }

    private avancerVoiture() {
        this.voiture3D.translateX(0.5);
    }

    public dirigerVoiture() {
        this.avancerVoiture();
        this.miseAjourDirectionDestination();
        this.miseAjourPositionCubeDirectionDestination();
        this.miseAjourPositionCubeDevant();
        this.faireTournerVoiture(this.obtenirSensRotationVoiture());
        if (this.voiture3D.position.distanceTo(this.listePositions[this.indiceCubeAAtteindre]) < 10) {
            this.indiceCubeAAtteindre = this.indiceCubeAAtteindre + 1;
        }
        if (this.indiceCubeAAtteindre === this.listePositions.length) {
            this.indiceCubeAAtteindre = 0;
        }
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
