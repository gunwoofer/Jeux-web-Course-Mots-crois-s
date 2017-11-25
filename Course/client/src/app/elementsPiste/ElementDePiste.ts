import { Voiture } from './../voiture/Voiture';
import { Piste } from '../piste/piste.model';
import { Segment } from './../piste/segment.model';
import * as THREE from 'three';


export abstract class ElementDePiste {
    protected position: THREE.Vector3;

    public segment: Segment;
    public piste: Piste;

    protected mesh: THREE.Mesh;
    public raycaster: THREE.Raycaster;
    public antirebond;


    constructor() {
        this.antirebond = false;
    }


    public abstract effetSurObstacle(voiture: Voiture): void;

    public abstract genererPositionAleatoire(segment: THREE.Vector3[]): THREE.Vector3;

    public genererRayCaster(vecteur: THREE.Vector3): void {
        const positionFlaqueDEau = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
        this.raycaster = new THREE.Raycaster(positionFlaqueDEau, vecteur);
    }


    protected trouverXAleatoire(x1: number, x2: number): number {
        return Math.random() * (Math.max(x1, x2) - Math.min(x1, x2)) + Math.min(x1, x2);
    }

    protected calculerPenteDroite(point1: THREE.Vector3, point2: THREE.Vector3): number {
        return ((point2.y - point1.y) / (point2.x - point1.x));
    }

    protected calculerOrdonneeALOrigine(point1: THREE.Vector3, pente: number): number {
        return (point1.y - pente * point1.x);
    }

    protected genererSegmentAleatoire(listePoints: THREE.Vector3[]): THREE.Vector3[] {
        const pointAleatoire = Math.round(Math.random() * (listePoints.length - 2));
        return [listePoints[pointAleatoire], listePoints[pointAleatoire + 1]];
    }
    public obtenirMesh(): THREE.Mesh {
        return this.mesh;
    }
}
