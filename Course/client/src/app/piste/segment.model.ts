import { ContraintesCircuitService } from './../contraintesCircuit/contraintesCircuit.service';
import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { Piste } from './piste.model';


export const LARGEUR_PISTE = 5;
export const HAUTEUR_DISQUE = 0.0005;
export const HAUTEUR_ZONE_DEPART = 0.01;
export const HAUTEUR_LIGNE_ARRIVEE = 0.1;


@Injectable()
export class Segment {
    private centre: THREE.Mesh;
    private piste: Piste;
    public premierSegment = new Array<THREE.Vector3>();

    constructor() { 

    }

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
            
                if(i===0)
                {
                    // this.premierSegment = geometrie.vertices;
                    for(let j = 0; j < 4; j++) {
                        this.premierSegment[j] = new THREE.Vector3(0, 0, 0);
                        this.premierSegment[j].copy(geometrie.vertices[j]);
                    }

                    let point = this.calculPointMilieu(geometrie.vertices);

                    this.premierSegment[1] = new THREE.Vector3(
                        point.x + A * LARGEUR_PISTE, point.y + B * LARGEUR_PISTE, HAUTEUR_ZONE_DEPART);
                    this.premierSegment[3] = new THREE.Vector3(
                        point.x - A * LARGEUR_PISTE, point.y - B * LARGEUR_PISTE, HAUTEUR_ZONE_DEPART);

                }

            
            const patch = new THREE.CircleBufferGeometry(6.5, 128);
            patch.translate(piste.listepositions[i].x, piste.listepositions[i].y,  HAUTEUR_DISQUE);

            const materiel = new THREE.MeshBasicMaterial( { map: texture} );
            segmentsPisteVisuel.push(new THREE.Mesh(patch, materiel));
            segmentsPisteVisuel.push(new THREE.Mesh(geometrie, materiel));

        }

        return segmentsPisteVisuel;
    }

    public obtenirPremierSegment(): Array<THREE.Vector3> {
        return this.premierSegment;
    }

        public ajoutLigneDepart(piste: Piste): THREE.Line {
            let materialLigneDepart = new THREE.LineBasicMaterial({color: 0XFF0000});
            let geometryLigneDepart = new THREE.Geometry();
            geometryLigneDepart.vertices.push(
                new THREE.Vector3( this.premierSegment[1].x, this.premierSegment[1].y, HAUTEUR_LIGNE_ARRIVEE ),
                new THREE.Vector3( this.premierSegment[3].x, this.premierSegment[3].y, HAUTEUR_LIGNE_ARRIVEE ),
            );


            let line = new THREE.Line( geometryLigneDepart, materialLigneDepart );

            return line;
        }


        public calculPointMilieu(sommets: THREE.Vector3[]): THREE.Vector3 {
            const centreSegmentX = ((sommets[0].x + sommets[2].x)/2 + (sommets[1].x + sommets[3].x)/2)/2;
            const centreSegmentY = ((sommets[0].y + sommets[2].y)/2 + (sommets[1].y + sommets[3].y)/2)/2;

            return new THREE.Vector3(centreSegmentX, centreSegmentY, 0);
        }

        public ajoutZoneDepart(piste: Piste): THREE.Mesh {
            const segmentDepart = new THREE.PlaneGeometry(1, 1);
            let zoneDepartVisuel: THREE.Mesh;

            const geometrieZoneDepart = new THREE.PlaneGeometry(1, 1);

            geometrieZoneDepart.vertices = this.premierSegment;

            const loaderZoneDepart = new THREE.TextureLoader();
            const textureZoneDepart = loaderZoneDepart.load('../../assets/textures/ligne_depart.jpg');

            const materielZoneDepart = new THREE.MeshBasicMaterial( { map: textureZoneDepart} );

            zoneDepartVisuel = new THREE.Mesh(geometrieZoneDepart, materielZoneDepart);
            
            return zoneDepartVisuel;
    }

    
}
