import { VITESSE_IA } from './../constant';
import { IndicateurVoiture } from './indicateursVoiture';

import * as THREE from 'three';

const COEFFICIENT_ACTUALISATION_DIRECTION = 0.999;
const ANGLEROTATION = 0.01;
const DISTANCE_MINIMALE_DETECTION_PRO = 45;
const DISTANCE_MINIMALE_DETECTION_AMA = 10;


export class MoteurAutonome {

    private indicateurVoiture: IndicateurVoiture;
    private indicateurDevant: THREE.Mesh;
    private indicateurDirectionDestination: THREE.Mesh;
    private directionDestination: THREE.Vector3;
    private directionIndicateurDevant: THREE.Vector3;
    private indiceCheckPointAAteindre: number;
    private engine: THREE.Object3D;
    private distanceMinimaleDetection: number;
    private valeurProdVectoriel: number;

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
        this.distanceMinimaleDetection = (niveau === 'Professionnel') ? DISTANCE_MINIMALE_DETECTION_PRO
                                                                      : DISTANCE_MINIMALE_DETECTION_AMA;
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
        this.engine.rotateY(ANGLEROTATION * sens * Math.min(this.valeurProdVectoriel, 3));
    }

    private avancerVoiture(): void {
        this.engine.translateX(VITESSE_IA);
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
