import * as THREE from 'three';
import { Piste } from './piste.model';

export const LARGEUR_PISTE = 15;
export const DIAMETRE_CERCLE = 18;
export const HAUTEUR_DEPART = 0.0001;
export const HAUTEUR_DISQUE = -0.0001;
export const HAUTEUR_LIGNE = 0.0002;
export const COTÉS = 4;
export const DIMENSION_PLAN = 1;

export class Segment {
    public premierSegment = new Array<THREE.Vector3>();
    public damierDeDepart: THREE.Mesh;

    public mettreSegmentsSurScene(piste: Piste, scene: THREE.Scene): void {
        for (let segment = 0; segment < this.chargerSegmentsDePiste(piste).length; segment++) {
            scene.add(this.chargerSegmentsDePiste(piste)[segment]);
        }
    }

    public chargerSegmentsDePiste(piste: Piste): THREE.Mesh[] {
        const segmentsPisteVisuel: THREE.Mesh[] = new Array();
        for (let i = 0; i < piste.listepositions.length - 1; i++) {
            this.constructionSegmentDePiste(piste, segmentsPisteVisuel, i);
        }
        return segmentsPisteVisuel;
    }

    public constructionSegmentDePiste(piste: Piste, segmentsPisteVisuel: THREE.Mesh[], indice: number): void {
        let facteurA = 1;
        let facteurB = 1;
        const geometrie = new THREE.PlaneGeometry(DIMENSION_PLAN, DIMENSION_PLAN);
        const materiel = new THREE.MeshStandardMaterial();
        if (piste.listepositions[indice].x < piste.listepositions[indice + 1].x) {
            if (piste.listepositions[indice].y < piste.listepositions[indice + 1].y) {
                facteurA = -1;
            }
        } else {
            if (piste.listepositions[indice].y < piste.listepositions[indice + 1].y) {
                facteurA = -1; facteurB = -1;
            } else {
                facteurB = -1;
            }
        }
        const texture = this.chargerTexture();
        this.manipulationMaterial(texture, materiel);
        this.manipulationGeometrie(geometrie, piste, indice, facteurA, facteurB);
        if (indice === 0) { this.manipulationPremierSegment(geometrie, facteurA, facteurB); }
        segmentsPisteVisuel.push(this.creerDisque(texture, piste, indice));
        segmentsPisteVisuel.push(new THREE.Mesh(geometrie, materiel));
    }

    public manipulationPremierSegment(geometrie: THREE.PlaneGeometry, facteurA: number, facteurB: number): void {
        for (let j = 0; j < COTÉS; j++) {
            this.premierSegment[j] = new THREE.Vector3();
            this.premierSegment[j].copy(geometrie.vertices[j]);
        }
        const point = this.calculPointMilieu(geometrie.vertices);
        this.premierSegment[1] = new THREE.Vector3(
            point.x + facteurA * LARGEUR_PISTE, point.y + facteurB * LARGEUR_PISTE, HAUTEUR_DEPART);
        this.premierSegment[3] = new THREE.Vector3(
            point.x - facteurA * LARGEUR_PISTE, point.y - facteurB * LARGEUR_PISTE, HAUTEUR_DEPART);
    }

    public chargerTexture(): THREE.Texture {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('../../assets/textures/asphalt.JPG', (txt) => {
            txt.wrapS = THREE.RepeatWrapping;
            txt.wrapT = THREE.RepeatWrapping;
            txt.anisotropy = 4;
            txt.repeat.set(10, 10);
        });
        return texture;
    }

    public manipulationMaterial(texture: THREE.Texture, materiel: THREE.MeshStandardMaterial): void {
        materiel.map = texture;
        materiel.needsUpdate = true;
    }

    public manipulationGeometrie(geometrie: THREE.PlaneGeometry, piste: Piste, indice: number, facteurA: number, facteurB: number): void {
        geometrie.vertices[0] = new THREE.Vector3(
            piste.listepositions[indice].x + facteurA * LARGEUR_PISTE, piste.listepositions[indice].y + facteurB * LARGEUR_PISTE, 0);
        geometrie.vertices[1] = new THREE.Vector3(
            piste.listepositions[indice + 1].x +
            facteurA * LARGEUR_PISTE, piste.listepositions[indice + 1].y + facteurB * LARGEUR_PISTE, 0);
        geometrie.vertices[2] = new THREE.Vector3(
            piste.listepositions[indice].x - facteurA * LARGEUR_PISTE, piste.listepositions[indice].y - facteurB * LARGEUR_PISTE, 0);
        geometrie.vertices[3] = new THREE.Vector3(
            piste.listepositions[indice + 1].x -
            facteurA * LARGEUR_PISTE, piste.listepositions[indice + 1].y - facteurB * LARGEUR_PISTE, 0);
    }

    private creerDisque(texture: THREE.Texture, piste: Piste, i: number): THREE.Mesh {
        const patch = new THREE.CircleBufferGeometry(DIAMETRE_CERCLE, 128);
        patch.translate(piste.listepositions[i].x, piste.listepositions[i].y, HAUTEUR_DISQUE);
        const materielDisque = new THREE.MeshStandardMaterial({ map: texture });
        return new THREE.Mesh(patch, materielDisque);
    }

    public calculPointMilieu(sommets: THREE.Vector3[]): THREE.Vector3 {
        const centreSegmentX = ((sommets[0].x + sommets[2].x) / 2 + (sommets[1].x + sommets[3].x) / 2) / 2;
        const centreSegmentY = ((sommets[0].y + sommets[2].y) / 2 + (sommets[1].y + sommets[3].y) / 2) / 2;
        return new THREE.Vector3(centreSegmentX, centreSegmentY, 0);
    }

    public ajoutDamier(piste: Piste): THREE.Mesh {
        const geometrieZoneDepart = new THREE.PlaneGeometry(DIMENSION_PLAN, DIMENSION_PLAN);
        const loaderZoneDepart = new THREE.TextureLoader();
        const materielZoneDepart = new THREE.MeshStandardMaterial();

        geometrieZoneDepart.vertices = this.premierSegment;
        loaderZoneDepart.load('../../assets/textures/ligne_depart.jpg', (texture) => {
            materielZoneDepart.map = texture;
        });
        this.damierDeDepart = new THREE.Mesh(geometrieZoneDepart, materielZoneDepart);
        return this.damierDeDepart;
    }

    public ajoutLigneDepart(piste: Piste): THREE.Line {
        const materialLigneDepart = new THREE.LineBasicMaterial({ color: 0XFF0000 });
        const geometryLigneDepart = new THREE.Geometry();
        geometryLigneDepart.vertices.push(
            new THREE.Vector3(this.premierSegment[1].x, this.premierSegment[1].y, HAUTEUR_LIGNE),
            new THREE.Vector3(this.premierSegment[3].x, this.premierSegment[3].y, HAUTEUR_LIGNE),
        );
        return new THREE.Line(geometryLigneDepart, materialLigneDepart);
    }
}
