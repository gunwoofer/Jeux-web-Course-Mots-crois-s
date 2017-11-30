import { IndicateurVoiture } from './indicateursVoiture';

import * as THREE from 'three';

export const COEFFICIENT_ACTUALISATION_DIRECTION = 0.999;
export const ANGLEROTATION = 0.01;

export class MoteurAutonome {

    public indicateurVoiture: IndicateurVoiture;
    public indicateurDevant: THREE.Mesh;
    public indicateurDirectionDestination: THREE.Mesh;
    public directionDestination: THREE.Vector3;
    public directionIndicateurDevant: THREE.Vector3;
    public indiceCheckPointAAteindre: number;
    public engine: THREE.Object3D;
    public distanceMinimaleDetection: number;
    public valeurProdVectoriel: number;

    constructor(listePositions: THREE.Vector3[], objet: THREE.Object3D, niveau: String) {
        this.indicateurVoiture = new IndicateurVoiture();
        this.directionIndicateurDevant = new THREE.Vector3();
        this.indiceCheckPointAAteindre = 1;
        this.engine = objet;
        this.niveau(niveau);
        this.miseAjourDirectionDestination(listePositions);
    }

    public dirigerVoiture(listePositions: THREE.Vector3[]): void {
        this.avancerVoiture();
        this.miseAjourDirectionDestination(listePositions);
        this.miseAjourPositionCubeDirectionDestination();
        this.miseAjourPositionCubeDevant();
        this.faireTournerVoiture(this.obtenirSensRotationVoiture());
        this.repetition(listePositions);
    }

    public niveau(niveau: String): void {
        if (niveau === 'Professionnel') {
            this.distanceMinimaleDetection = 45;
        } else {
            this.distanceMinimaleDetection = 10;
        }
    }

    public repetition(listePositions: THREE.Vector3[]): void {
        if (this.engine.position.distanceTo(listePositions[this.indiceCheckPointAAteindre]) < this.distanceMinimaleDetection) {
            this.indiceCheckPointAAteindre = this.indiceCheckPointAAteindre + 1;
        }
        if (this.indiceCheckPointAAteindre === listePositions.length) {
            this.indiceCheckPointAAteindre = 0;
        }
    }

    private faireTournerVoiture(sens: number): void {
        this.engine.rotateY(ANGLEROTATION * sens * Math.min(this.valeurProdVectoriel, 3));
    }

    private avancerVoiture(): void {
        this.engine.translateX(0.5);
    }

    public creerIndicateurDevant(scene: THREE.Scene): void {
        this.indicateurDevant = this.indicateurVoiture.creerIndicateurVoiture(new THREE.Vector3()
            .copy(this.engine.position)
            .add(this.directionDestination));
        scene.add(this.indicateurDevant);
    }

    public creerIndicateurDirection(scene: THREE.Scene, listePositions: THREE.Vector3[]): void {
        this.indicateurDirectionDestination = this.indicateurVoiture
            .creerIndicateurVoiture(new THREE.Vector3()
                .copy(this.engine.position)
                .add(this.directionDestination));
        this.miseAjourDirectionDestination(listePositions);
        scene.add(this.indicateurDirectionDestination);
    }

    public miseAjourDirectionDestination(listePositions: THREE.Vector3[]): void {
        this.directionDestination = new THREE.Vector3()
            .copy(listePositions[this.indiceCheckPointAAteindre])
            .add(new THREE.Vector3()
                .copy(this.engine.position)
                .negate()).normalize();
    }

    public miseAjourPositionCubeDirectionDestination(): void {
        const positionIndicDirection = new THREE.Vector3().addVectors(this.engine.position,
            new THREE.Vector3()
                .copy(this.directionDestination)
                .multiplyScalar(50));
        this.indicateurDirectionDestination.position
            .set(positionIndicDirection.x, positionIndicDirection.y, positionIndicDirection.z);
    }

    public miseAjourPositionCubeDevant(): void {
        // const angleOrientationCube = this.engine.getWorldRotation().z;
        const vecteurDirection = new THREE.Vector3()
            .subVectors(this.engine.localToWorld(new THREE.Vector3(1, 0, 0)), this.engine.position).normalize();
        if (new THREE.Vector3().copy(this.directionIndicateurDevant).dot(vecteurDirection) < COEFFICIENT_ACTUALISATION_DIRECTION) {
            this.directionIndicateurDevant = new THREE.Vector3().copy(vecteurDirection);
        }
        const positionIndicDeplacement = new THREE.Vector3()
            .copy(this.engine.position)
            .add(vecteurDirection.multiplyScalar(30));
        this.indicateurDevant.position.set(positionIndicDeplacement.x, positionIndicDeplacement.y, positionIndicDeplacement.z);
    }

    private obtenirSensRotationVoiture(): number { // >0 --> Gauche
        const vecteurProduitVectoriel = new THREE.Vector3()
            .copy(this.directionIndicateurDevant)
            .cross(new THREE.Vector3()
                .copy(this.directionDestination));
            this.valeurProdVectoriel = Math.cos(vecteurProduitVectoriel.z);
        return Math.sign(vecteurProduitVectoriel.z);
    }

}
