import { Accelerateur } from './Accelerateur';
import { FlaqueDEau } from './FlaqueDEau';
import { NidDePoule } from './NidDePoule';
import { Vecteur } from '../../../../commun/Vecteur';

export enum TypeElementPiste {
    Accelerateur,
    FlaqueDEau,
    NidDePoule
}

export abstract class ElementDePiste {
    private x: number;
    private y: number;
    private z: number;
    private geometrie: THREE.Geometry;
    private materiel: THREE.Material;
    private mesh: THREE.Mesh;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public abstract effetSurObstacle(): void;

    public obtenirMesh(): THREE.Mesh {
        return this.mesh;
    }

    public genererPositionAleatoire(listeSegments: THREE.Mesh[]): THREE.Vector3 {
        // Prendre aleatoirement des segments
        // Pour chaque segment aleatoirement choisi faire :
        // this.genererPointAleatoireSegment(segmentaleatoire);
        return;
    }

    private genererPointAleatoireSegment(segment: THREE.Mesh): THREE.Vector3 {
        return;
    }

}
