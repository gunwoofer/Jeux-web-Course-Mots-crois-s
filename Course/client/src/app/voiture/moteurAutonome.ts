import { IndicateurVoiture } from './indicateursVoiture';

import * as THREE from 'three';

export class MoteurAutonome {

    public indicateurVoiture: IndicateurVoiture;
    public indicateurDevant: THREE.Mesh;
    public indicateurDirectionDestination: THREE.Mesh;
    private directionDestination: THREE.Vector3;
    private directionDevantCube: THREE.Vector3;

    constructor() {
        this.indicateurVoiture = new IndicateurVoiture();
    }

    public creerCubeDevant(scene: THREE.Scene, objet: THREE.Object3D ) {
        this.indicateurDevant = this.indicateurVoiture.creerIndicateurVoiture
        (new THREE.Vector3().copy(objet.position).add(this.directionDestination));
        scene.add(this.indicateurDevant);
    }
}