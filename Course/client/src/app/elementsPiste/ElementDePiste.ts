import { Voiture } from './../voiture/Voiture';
import { Piste } from '../piste/piste.model';
import { Segment } from './../piste/segment.model';
import * as THREE from 'three';


export abstract class ElementDePiste {
    protected x: number;
    protected y: number;
    protected z: number;

    public segment: Segment;
    public piste: Piste;

    protected mesh: THREE.Mesh;
    public raycaster: THREE.Raycaster;
    public antirebond;


    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.antirebond = false;
    }

    public abstract genererRayCaster(vecteur: THREE.Vector3): void;

    public abstract effetSurObstacle(voiture: Voiture): void;


    public obtenirMesh(): THREE.Mesh {
        return this.mesh;
    }

    public genererPositionAleatoire(segment: THREE.Mesh[]): THREE.Vector3 {
        // Prendre aleatoirement des segments
        // Pour chaque segment aleatoirement choisi faire :
        // this.genererPointAleatoireSegment(segmentaleatoire)

        console.log('Coucou');

        return;
    }


    private genererAleatoireSegment(segment: THREE.Mesh[]): THREE.Mesh {
        const nombreAleatoirePourSegment = Math.round(Math.random() * ( segment.length - 1 ));
        return segment[nombreAleatoirePourSegment];
    }
}
