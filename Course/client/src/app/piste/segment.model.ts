import * as THREE from 'three';
import { Piste } from './piste.model';

export const LARGEUR_PISTE = 10;

export class Segment {
    public chargerSegmentsDePiste(piste: Piste): THREE.Mesh[] {
        const segmentsPisteVisuel: THREE.Mesh[] = new Array();
        const premierSegment = new THREE.PlaneGeometry(1, 1);

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

            if (i === 0) {
                premierSegment.vertices[0] = geometrie.vertices[0];
                premierSegment.vertices[1] = geometrie.vertices[1];
                premierSegment.vertices[2] = geometrie.vertices[2];
                premierSegment.vertices[3] = geometrie.vertices[3];
            }
            const patch = new THREE.CircleBufferGeometry(LARGEUR_PISTE, 128);
            patch.translate(piste.listepositions[i].x, piste.listepositions[i].y,  piste.listepositions[i].z);

            const materiel = new THREE.MeshBasicMaterial( { map: texture} );
            segmentsPisteVisuel.push(new THREE.Mesh(patch, materiel));
            segmentsPisteVisuel.push(new THREE.Mesh(geometrie, materiel));
           // segmentsPisteVisuel.push(new THREE.Mesh(ligneDepart, materiel));
        }

        const loaderDepart = new THREE.TextureLoader();
        const textureDepart = loaderDepart.load('../../assets/textures/ligne_depart.jpg');
        const ligneArriver = new THREE.PlaneGeometry(1, 1);

        ligneArriver.vertices[0] = new THREE.Vector3(premierSegment.vertices[0].x, premierSegment.vertices[0].y, 0);
        ligneArriver.vertices[1] = new THREE.Vector3((premierSegment.vertices[1].x), (premierSegment.vertices[1].y), 0);
        ligneArriver.vertices[2] = new THREE.Vector3((premierSegment.vertices[2].x ) , (premierSegment.vertices[2].y) , 0);
        ligneArriver.vertices[3] = new THREE.Vector3((premierSegment.vertices[3].x), (premierSegment.vertices[3].y), 0);

        ligneArriver.scale(0.7, 0.7, 0);
        ligneArriver.translate(-8, 8, 0);
        const materielDepart = new THREE.MeshBasicMaterial( { map: textureDepart} );
        segmentsPisteVisuel.push(new THREE.Mesh(ligneArriver, materielDepart));

        return segmentsPisteVisuel;
    }
}
