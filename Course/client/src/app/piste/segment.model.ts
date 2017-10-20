import * as THREE from 'three';
import { Piste } from './piste.model';
export const LARGEUR_PISTE = 5;

export class Segment {
    public static chargerSegmentsDePiste(piste: Piste): THREE.Mesh[] {
        const segmentsPisteVisuel: THREE.Mesh[] = new Array();

        for (let i = 0; i < piste.listepositions.length - 1; i++) {
            let A = 1;
            let B = 1;
            const geometrie = new THREE.PlaneGeometry(1, 1);
            if (piste.listepositions[i].x < piste.listepositions[i + 1].x) {
                if (piste.listepositions[i].y < piste.listepositions[i + 1].y) {
                    A = -1;
                }
            } else {
                if (piste.listepositions[i].y < piste.listepositions[i + 1].y) {
                    A = -1; B = -1;
                } else {
                    B = -1;
                }
            }
            const loader = new THREE.TextureLoader();
            const texture = loader.load('../../assets/textures/paving-stone.jpg');
            geometrie.vertices[0] = new THREE.Vector3(
                piste.listepositions[i].x + A * LARGEUR_PISTE, piste.listepositions[i].y + B * LARGEUR_PISTE, 0);
            geometrie.vertices[1] = new THREE.Vector3(
                piste.listepositions[i + 1].x + A * LARGEUR_PISTE, piste.listepositions[i + 1].y + B * LARGEUR_PISTE, 0);
            geometrie.vertices[2] = new THREE.Vector3(
                piste.listepositions[i].x - A * LARGEUR_PISTE, piste.listepositions[i].y - B * LARGEUR_PISTE, 0);
            geometrie.vertices[3] = new THREE.Vector3(
                piste.listepositions[i + 1].x - A * LARGEUR_PISTE, piste.listepositions[i + 1].y - B * LARGEUR_PISTE, 0);

            const materiel = new THREE.MeshBasicMaterial( { map: texture} );
            segmentsPisteVisuel.push(new THREE.Mesh(geometrie, materiel));
        }


        return segmentsPisteVisuel;
    }
}
