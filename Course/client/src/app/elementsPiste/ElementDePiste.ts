import { FonctionMaths } from './../fonctionMathematiques';
import { Voiture } from './../voiture/Voiture';
import * as THREE from 'three';
import { POSITION_OBSTACLE_EN_Z } from '../constant';

export enum TypeElementPiste {
    Accelerateur,
    FlaqueDEau,
    NidDePoule
}

export abstract class ElementDePiste {
    public position: THREE.Vector3;
    public raycaster: THREE.Raycaster;
    public antirebond;
    public typeElementDePiste: TypeElementPiste;

    protected mesh: THREE.Mesh;

    constructor() {
        this.antirebond = false;
    }

    public abstract effetSurObstacle(voiture: Voiture): void;

    public genererRayCaster(vecteur: THREE.Vector3): void {
        const positionFlaqueDEau = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
        this.raycaster = new THREE.Raycaster(positionFlaqueDEau, vecteur);
    }

    public obtenirMesh(): THREE.Mesh {
        return this.mesh;
    }

    public genererPositionAleatoire(listePosition: THREE.Vector3[], estUnAccelerateur: boolean): THREE.Vector3 {
        const segmentAleatoire = this.genererSegmentAleatoire(listePosition);
        const pointDebut = segmentAleatoire[0];
        const pointFin = segmentAleatoire[1];

        const x = (estUnAccelerateur) ? FonctionMaths.trouverXAleatoire(pointDebut.x,
                                        FonctionMaths.obtenirMoitieEntre2points(pointDebut.x, pointFin.x))
                                    : FonctionMaths.trouverXAleatoire(pointDebut.x, pointFin.x);

        const pente = FonctionMaths.calculerPenteDroite(pointDebut, pointFin);
        const y = pente * x + FonctionMaths.calculerOrdonneeALOrigine(pointDebut, pente);

        return new THREE.Vector3(x, y, POSITION_OBSTACLE_EN_Z);
    }

    private genererSegmentAleatoire(listePoints: THREE.Vector3[]): THREE.Vector3[] {
        const pointAleatoire = Math.round(Math.random() * (listePoints.length - 2));
        return [listePoints[pointAleatoire], listePoints[pointAleatoire + 1]];
    }
}
