import { NOM_BOOST, EffetSonore } from './../effetSonore/effetSonore';
import { LARGEUR_ACCELERATEUR, LONGUEUR_ACCELERATEUR, REPETITION_TEXTURE_ACCELERATEUR } from './../constant';
import { Voiture } from './../voiture/Voiture';
import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import * as THREE from 'three';
import { CHEMIN_ACCES_ACCELERATEUR, NIVEAU_CLARETE } from '../constant';
import { Texture } from 'three';
import { Piste } from '../piste/piste.model';
import { DeplacementVoiture } from '../deplacement/deplacementVoiture';

export class Accelerateur extends ElementDePiste {

    constructor(listePosition: THREE.Vector3[], position?: THREE.Vector3) {
        super();
        this.typeElementDePiste = TypeElementPiste.Accelerateur;
        this.position = (position) ? position : Piste.genererPositionAleatoire(listePosition, true);
    }

    public genererMesh(): void {
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(LARGEUR_ACCELERATEUR, LONGUEUR_ACCELERATEUR),
            this.genererMaterial());
    }

    public effetSurObstacle(voiture: Voiture): void {
        EffetSonore.jouerUnEffetSonore(NOM_BOOST);
        DeplacementVoiture.augmenterVitesseAccelerateur(voiture);
    }

    public genererMaterial(): THREE.MeshPhongMaterial {
        return this.chargerTexture(new THREE.MeshPhongMaterial());
    }

    public chargerTexture(materiel: THREE.MeshPhongMaterial): THREE.MeshPhongMaterial {
        new THREE.TextureLoader().load(CHEMIN_ACCES_ACCELERATEUR, (texture: Texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = NIVEAU_CLARETE;
            texture.repeat.set(REPETITION_TEXTURE_ACCELERATEUR, REPETITION_TEXTURE_ACCELERATEUR);
            materiel.map = texture;
            materiel.needsUpdate = true;
        });

        return materiel;
    }

}
