import { DeplacementService } from './../generateurPiste/deplacement.service';
import { Voiture } from './../voiture/Voiture';
import * as THREE from 'three';


export abstract class ElementDePiste {
    protected position: THREE.Vector3;
    protected mesh: THREE.Mesh;
    protected deplacementService: DeplacementService;
    public raycaster: THREE.Raycaster;
    public antirebond;

    constructor() {
        this.antirebond = false;
        this.deplacementService = new DeplacementService();
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
