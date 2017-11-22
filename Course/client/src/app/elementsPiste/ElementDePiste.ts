import { Voiture } from './../voiture/Voiture';



export abstract class ElementDePiste {
    protected x: number;
    protected y: number;
    protected z: number;
    protected mesh: THREE.Mesh;
    public antirebond: boolean;
    public raycaster: THREE.Raycaster;


    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public abstract genererRayCaster(vecteur: THREE.Vector3): void;

    public abstract effetSurObstacle(voiture: Voiture): void;


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
