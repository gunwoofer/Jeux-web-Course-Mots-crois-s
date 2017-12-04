import { DIMENSION_CHECK_POINT } from './../constant';
import * as THREE from 'three';
import { Piste } from './piste.model';

export class PointDeControle {

    public static ajouterPointDeControleScene(piste: Piste, scene: THREE.Scene): void {
        const checkPoints = this.creationPointDeControle(piste);
        for (let checkPoint = 0; checkPoint < checkPoints.length; checkPoint++) {
            scene.add(checkPoint[checkPoint]);
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
        const geometry = new THREE.BoxGeometry(DIMENSION_CHECK_POINT, DIMENSION_CHECK_POINT, DIMENSION_CHECK_POINT);
        const material = new THREE.MeshBasicMaterial({ visible: false });
        const cube = new THREE.Mesh(geometry, material);
        return cube;
    }
}
