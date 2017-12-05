import {
    COEFFICIENT_ACTUALISATION_DIRECTION, VITESSE_MAX_PROFESSIONNEL, VITESSE_MAX_AMATEUR,
    ANGLEROTATION, DISTANCE_MINIMALE_DETECTION_PROFESSIONNEL, DISTANCE_MINIMALE_DETECTION_AMATEUR,
    VITESSE_MIN_PROFESSIONNEL, VITESSE_MIN_AMATEUR, PAS_VARIATION_VITESSE_PROFESSIONNEL, PAS_VARIATION_VITESSE_AMATEUR,
    FACTEUR_MULTIPLICATION_ROTATION_PROFESSIONNEL, FACTEUR_MULTIPLICATION_ROTATION_AMATEUR, PROFESSIONNNEL
} from './../constant';
import { IndicateurVoiture } from './indicateursVoiture';

import * as THREE from 'three';

export class MoteurAutonome {

    private indicateurVoiture: IndicateurVoiture;
    private indicateurDevant: THREE.Mesh;
    private indicateurDirectionDestination: THREE.Mesh;
    private directionDestination: THREE.Vector3;
    private directionIndicateurDevant: THREE.Vector3;
    private indiceCheckPointAAteindre: number;
    private engine: THREE.Object3D;
    private distanceMinimaleDetection: number;
    private vitesseMax: number;
    private vitesseMin: number;
    private pasVariationVitesse: number;
    private facteurMultiplicationRotation: number;

    private valeurProdVectoriel: number;
    private vitesse = 2;

    constructor(listePositions: THREE.Vector3[], objet: THREE.Object3D, niveau: String) {
        this.indicateurVoiture = new IndicateurVoiture();
        this.directionIndicateurDevant = new THREE.Vector3();
        this.indiceCheckPointAAteindre = 1;
        this.engine = objet;
        this.definirNiveau(niveau);
        this.miseAJourDirectionDestination(listePositions);
    }

    public dirigerVoiture(listePositions: THREE.Vector3[]): void {
        this.avancerVoiture();
        this.miseAJourDirectionDestination(listePositions);
        this.miseAJourPositionCubeDirectionDestination();
        this.miseAJourPositionCubeDevant();
        this.tournerVoiture(this.obtenirSensRotationVoiture());
        this.repetition(listePositions);
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
        this.miseAJourDirectionDestination(listePositions);
        scene.add(this.indicateurDirectionDestination);
    }

    private definirNiveau(niveau: String): void {
        if (niveau === PROFESSIONNNEL) {
            this.distanceMinimaleDetection = DISTANCE_MINIMALE_DETECTION_PROFESSIONNEL;
            this.vitesseMax = VITESSE_MAX_PROFESSIONNEL;
            this.vitesseMin = VITESSE_MIN_PROFESSIONNEL;
            this.pasVariationVitesse = PAS_VARIATION_VITESSE_PROFESSIONNEL;
            this.facteurMultiplicationRotation = FACTEUR_MULTIPLICATION_ROTATION_PROFESSIONNEL;
        } else {
            this.distanceMinimaleDetection = DISTANCE_MINIMALE_DETECTION_AMATEUR;
            this.vitesseMax = VITESSE_MAX_AMATEUR;
            this.vitesseMin = VITESSE_MIN_AMATEUR;
            this.pasVariationVitesse = PAS_VARIATION_VITESSE_AMATEUR;
            this.facteurMultiplicationRotation = FACTEUR_MULTIPLICATION_ROTATION_AMATEUR;
        }
    }

    private repetition(listePositions: THREE.Vector3[]): void {
        if (this.engine.position.distanceTo(listePositions[this.indiceCheckPointAAteindre]) < this.distanceMinimaleDetection) {
            this.indiceCheckPointAAteindre = this.indiceCheckPointAAteindre + 1;
        }

        if (this.indiceCheckPointAAteindre === listePositions.length) {
            this.indiceCheckPointAAteindre = 0;
        }
    }

    private tournerVoiture(sens: number): void {
        let facteurMultiplication = 1;
        console.log(this.valeurProdVectoriel);
        if (this.valeurProdVectoriel < 0.95) {
            facteurMultiplication = this.facteurMultiplicationRotation;
            this.vitesse = Math.max(this.vitesseMin, this.vitesse - this.pasVariationVitesse);
        } else {
            this.vitesse = Math.min(this.vitesseMax, this.vitesse + this.pasVariationVitesse);
        }
        this.engine.rotateY(ANGLEROTATION * sens * facteurMultiplication);
    }

    private avancerVoiture(): void {
        this.engine.translateX(this.vitesse);
    }

    private miseAJourDirectionDestination(listePositions: THREE.Vector3[]): void {
        this.directionDestination = new THREE.Vector3()
            .copy(listePositions[this.indiceCheckPointAAteindre])
            .add(new THREE.Vector3()
                .copy(this.engine.position)
                .negate()).normalize();
    }

    private miseAJourPositionCubeDirectionDestination(): void {
        const positionIndicDirection = new THREE.Vector3().addVectors(this.engine.position,
            new THREE.Vector3()
                .copy(this.directionDestination)
                .multiplyScalar(50));
        this.indicateurDirectionDestination.position
            .set(positionIndicDirection.x, positionIndicDirection.y, positionIndicDirection.z);
    }

    private miseAJourPositionCubeDevant(): void {
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
