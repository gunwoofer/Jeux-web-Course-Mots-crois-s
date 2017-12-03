import * as THREE from 'three';
import { Piste } from './piste.model';


export class PointDeControle {

    public static ajouterPointDeControleScene(piste: Piste, scene: THREE.Scene): void {
        const checkPoint = this.creationPointDeControle(piste);
        for (let i = 0; i < checkPoint.length; i++) {
            scene.add(checkPoint[i]);
        }
    }

    private static creationPointDeControle(piste: Piste): THREE.Mesh[] {
        const checkPoint: THREE.Mesh[] = [];
        for (let i = 0; i < piste.listepositions.length - 1; i++) {
            this.ajoutPointDeControle(piste, i, checkPoint);
        }
        return checkPoint;
    }

    private static ajoutPointDeControle(piste: Piste, indice: number, vecteur: THREE.Mesh[]): void {
        const cube = this.constructionDeCube();
        cube.position.set(piste.listepositions[indice].x, piste.listepositions[indice].y, 0);
        vecteur.push(cube);
    }

    private static constructionDeCube(): THREE.Mesh {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, visible: false });
        const cube = new THREE.Mesh(geometry, material);
        return cube;
    }
}
