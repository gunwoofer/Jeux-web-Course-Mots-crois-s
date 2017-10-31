import { ContraintesCircuitService } from './../contraintesCircuit/contraintesCircuit.service';
import * as THREE from 'three';
import { Piste } from './piste.model';

export const LARGEUR_PISTE = 5;
export const LARGEUR_LIGNE_ARRIVER = 5;
export const DISTANCE_LIGNE_ARRIVER = 5;

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
            
  
            /* const ligneDepart = new THREE.PlaneGeometry(1, 1);

             ligneDepart.vertices[0] = new THREE.Vector3(piste.listepositions[0].x + LARGEUR_PISTE, piste.listepositions[0].y, 0);
             ligneDepart.vertices[1] = new THREE.Vector3(piste.listepositions[0].x - LARGEUR_PISTE, piste.listepositions[0].y, 0);
             ligneDepart.vertices[2] = new THREE.Vector3(piste.listepositions[0].x + LARGEUR_PISTE, piste.listepositions[0].y + LARGEUR_LIGNE_ARRIVER, 0);
             ligneDepart.vertices[3] = new THREE.Vector3(piste.listepositions[0].x - LARGEUR_PISTE, piste.listepositions[0].y + LARGEUR_LIGNE_ARRIVER, 0);
               */   
           // const patch = new THREE.CircleBufferGeometry(5, 1);
         /*  const patch = new THREE.PlaneGeometry(1, 1);


          /*  patch.vertices[0] = new THREE.Vector3(piste.listepositions[0].x + LARGEUR_PISTE, piste.listepositions[0].y, 0);
            patch.vertices[1] = new THREE.Vector3(piste.listepositions[0].x - LARGEUR_PISTE, piste.listepositions[0].y, 0);
            patch.vertices[2] = new THREE.Vector3(piste.listepositions[0].x + LARGEUR_PISTE, piste.listepositions[0].y + LARGEUR_LIGNE_ARRIVER, 0);
            patch.vertices[3] = new THREE.Vector3(piste.listepositions[0].x - LARGEUR_PISTE, piste.listepositions[0].y + LARGEUR_LIGNE_ARRIVER, 0);
            */
            
            
            const patch = new THREE.CircleBufferGeometry(6.5, 128);
            patch.translate(piste.listepositions[i].x, piste.listepositions[i].y,  piste.listepositions[i].z);

            const materiel = new THREE.MeshBasicMaterial( { map: texture} );
            segmentsPisteVisuel.push(new THREE.Mesh(patch, materiel));
            segmentsPisteVisuel.push(new THREE.Mesh(geometrie, materiel));
           // segmentsPisteVisuel.push(new THREE.Mesh(ligneDepart, materiel));

        }

        // this.ajoutDepart(piste);
        //const depart = new THREE.Vector3(piste.listepositions[1].x-piste.listepositions[0].x, piste.listepositions[1].y - piste.listepositions[0].y, piste.listepositions[1].z - piste.listepositions[0].z);
        //var material = new THREE.LineBasicMaterial({ color: 0xff00000 });
        const loader = new THREE.TextureLoader();
        const texture = loader.load('../../assets/textures/ligne_depart.jpg');
        const ligneArriver = new THREE.PlaneGeometry(1, 1);
       // piste.listepositions[0].x = piste.listepositions[0].x - DISTANCE_LIGNE_ARRIVER;
       // piste.listepositions[0].y = piste.listepositions[0].y - DISTANCE_LIGNE_ARRIVER;
        ligneArriver.vertices[0] = new THREE.Vector3((piste.listepositions[0].x + LARGEUR_LIGNE_ARRIVER) + DISTANCE_LIGNE_ARRIVER, (piste.listepositions[0].y - LARGEUR_LIGNE_ARRIVER)+ DISTANCE_LIGNE_ARRIVER, 0);
        ligneArriver.vertices[1] = new THREE.Vector3((piste.listepositions[0].x - LARGEUR_LIGNE_ARRIVER) + DISTANCE_LIGNE_ARRIVER, (piste.listepositions[0].y - LARGEUR_LIGNE_ARRIVER)+ DISTANCE_LIGNE_ARRIVER, 0);
        ligneArriver.vertices[2] = new THREE.Vector3((piste.listepositions[0].x + LARGEUR_LIGNE_ARRIVER) - DISTANCE_LIGNE_ARRIVER, (piste.listepositions[0].y + LARGEUR_LIGNE_ARRIVER) + DISTANCE_LIGNE_ARRIVER, 0);
        ligneArriver.vertices[3] = new THREE.Vector3((piste.listepositions[0].x - LARGEUR_LIGNE_ARRIVER) - DISTANCE_LIGNE_ARRIVER, (piste.listepositions[0].y + LARGEUR_LIGNE_ARRIVER) + DISTANCE_LIGNE_ARRIVER, 0);
        //  geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
      // geometry.vertices[4] = new THREE.Vector3(geometry, material);
      const materiel = new THREE.MeshBasicMaterial( { map: texture} );
      segmentsPisteVisuel.push(new THREE.Mesh(ligneArriver, materiel));

        return segmentsPisteVisuel;
    }

        public static ajoutDepart(piste: Piste): THREE.PlaneGeometry {
        const segmentDepart = new THREE.PlaneGeometry(1, 1);
        segmentDepart.vertices[0] = new THREE.Vector3(piste.listepositions[0].x  * LARGEUR_PISTE, piste.listepositions[0].y +  LARGEUR_PISTE, 0); 
        var color = new THREE.Color("rgb(255, 0, 0)");
        segmentDepart.colors.push(new THREE.Color(0xFF0000));
        return segmentDepart;
    }
}
