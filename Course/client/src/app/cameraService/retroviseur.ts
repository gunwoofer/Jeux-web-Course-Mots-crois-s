import { HAUTEUR_RETROVISEUR, LARGEUR_RETROVISEUR } from './../constant';
import * as THREE from 'three';

export class Retroviseur {
    public coinX: number;
    public coinY: number;
    public largeur: number;
    public hauteur: number;
    public camera: THREE.PerspectiveCamera;

    constructor(aspectRatio: number, clientLargeur: number, clientHauteur: number) {
        this.largeur = LARGEUR_RETROVISEUR;
        this.hauteur = HAUTEUR_RETROVISEUR;
        this.coinX = clientLargeur / 2 - this.largeur / 2;
        this.coinY = clientHauteur - this.hauteur;
        this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 6000);
    }



}
