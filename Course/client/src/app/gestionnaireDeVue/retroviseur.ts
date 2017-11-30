import { Voiture } from './../voiture/Voiture';
import { HAUTEUR_RETROVISEUR, LARGEUR_RETROVISEUR } from './../constant';
import * as THREE from 'three';

export class Retroviseur {
    public coinX: number;
    public coinY: number;
    public largeur: number;
    public hauteur: number;
    public camera: THREE.PerspectiveCamera;

    constructor(container: HTMLDivElement, voiture: Voiture) {
        this.largeur = LARGEUR_RETROVISEUR;
        this.hauteur = HAUTEUR_RETROVISEUR;
        this.coinX = container.clientWidth / 2 - this.largeur / 2;
        this.coinY = container.clientHeight - this.hauteur;
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 6000);
        this.vueRetroviseur(voiture);
    }

    public vueRetroviseur(voiture: Voiture): void {
        voiture.obtenirVoiture3D().add(this.camera);
        this.camera.position.y = 2;
        this.camera.rotateY(Math.PI / 2);
    }
}
