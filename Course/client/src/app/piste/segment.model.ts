import * as THREE from 'three';
import { Piste } from './piste.model';

export const LARGEUR_PISTE = 10;
export const DIAMETRE_CERCLE = 12;
export const HAUTEUR = 0.0005;
export const HAUTEUR_DISQUE = -0.0005;
export const HAUTEUR_LIGNE = 0.0006;

export class Segment {
    public premierSegment = new Array<THREE.Vector3>();

    public chargerSegmentsDePiste(piste: Piste): THREE.Mesh[] {
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

            const materiel = new THREE.MeshStandardMaterial();
            const loader = new THREE.TextureLoader();
            const texture = loader.load('../../assets/textures/asphalt.JPG', (txt) => {
                txt.wrapS = THREE.RepeatWrapping;
                txt.wrapT = THREE.RepeatWrapping;
                txt.anisotropy = 4;
                txt.repeat.set( 10, 10 );
                materiel.map = txt;
                materiel.needsUpdate = true;
            });

            geometrie.vertices[0] = new THREE.Vector3(
                piste.listepositions[i].x + A * LARGEUR_PISTE, piste.listepositions[i].y + B * LARGEUR_PISTE, 0);
            geometrie.vertices[1] = new THREE.Vector3(
                piste.listepositions[i + 1].x + A * LARGEUR_PISTE, piste.listepositions[i + 1].y + B * LARGEUR_PISTE, 0);
            geometrie.vertices[2] = new THREE.Vector3(
                piste.listepositions[i].x - A * LARGEUR_PISTE, piste.listepositions[i].y - B * LARGEUR_PISTE, 0);
            geometrie.vertices[3] = new THREE.Vector3(
                piste.listepositions[i + 1].x - A * LARGEUR_PISTE, piste.listepositions[i + 1].y - B * LARGEUR_PISTE, 0);

            if (i === 0) {
                for (let j = 0; j < 4; j++) {
                    this.premierSegment[j] = new THREE.Vector3(0, 0, 0);
                    this.premierSegment[j].copy(geometrie.vertices[j]);
                }
                const point = this.calculPointMilieu(geometrie.vertices);
                this.premierSegment[1] = new THREE.Vector3(
                    point.x + A * LARGEUR_PISTE, point.y + B * LARGEUR_PISTE, HAUTEUR);
                this.premierSegment[3] = new THREE.Vector3(
                    point.x - A * LARGEUR_PISTE, point.y - B * LARGEUR_PISTE, HAUTEUR);
            }
            segmentsPisteVisuel.push(this.creerDisque(texture, piste, i));
            segmentsPisteVisuel.push(new THREE.Mesh(geometrie, materiel));
        }
        return segmentsPisteVisuel;
    }

    private creerDisque(texture: THREE.Texture, piste: Piste, i: number): THREE.Mesh {
        const patch = new THREE.CircleBufferGeometry(DIAMETRE_CERCLE, 128);
        patch.translate(piste.listepositions[i].x, piste.listepositions[i].y,  HAUTEUR_DISQUE);
        const materielDisque = new THREE.MeshBasicMaterial( { map: texture} );
        return new THREE.Mesh(patch, materielDisque);
    }
}
