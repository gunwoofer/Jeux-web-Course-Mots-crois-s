import { LARGEUR_ACCELERATEUR, LONGUEUR_ACCELERATEUR } from './../constant';
import { DeplacementService } from './../generateurPiste/deplacement.service';
import { Voiture } from './../voiture/Voiture';
import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import * as THREE from 'three';
import { CHEMIN_ACCES_ACCELERATEUR, NIVEAU_CLARETE } from '../constant';

export class Accelerateur extends ElementDePiste {

    constructor(listePosition: THREE.Vector3[], position?: THREE.Vector3) {
        super();

        this.typeElementDePiste = TypeElementPiste.Accelerateur;
        this.position = (position) ? position : this.genererPositionAleatoire(listePosition, true);
    }

    public genererMesh(): void {
        const materiel = new THREE.MeshPhongMaterial();
        const loader = new THREE.TextureLoader();

        loader.load(CHEMIN_ACCES_ACCELERATEUR, (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = NIVEAU_CLARETE;
            texture.repeat.set( 1, 1);
            materiel.map = texture;
            materiel.needsUpdate = true;
        });
        const accelerateurGeometrie = new THREE.PlaneGeometry(LARGEUR_ACCELERATEUR, LONGUEUR_ACCELERATEUR);
        this.mesh = new THREE.Mesh(accelerateurGeometrie, materiel);
    }

    public effetSurObstacle(voiture: Voiture): void {
        DeplacementService.augmenterVitesseAccelerateur(voiture);
    }

}
