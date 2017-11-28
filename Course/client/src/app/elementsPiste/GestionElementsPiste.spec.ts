import * as THREE from 'three';
import { GestionElementsPiste } from './GestionElementsPiste';
import { generate } from 'rxjs/observable/generate';

describe('GestionElementsPiste', () => {
  it('Il ne devrait pas avoir de nombre pair d\'elements de piste.', () => {
    const gestionElementsPiste: GestionElementsPiste = new GestionElementsPiste();
    const listePosition = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 5, 0),
      new THREE.Vector3(20, 15, 0), new THREE.Vector3(0, 0, 0)];
    for (let i = 0; i < 2; i++) {
      gestionElementsPiste.ajouterElementDePiste(listePosition);
    }

    expect(gestionElementsPiste.nombreElementsEstImpair()).toBe(true);
  });

  it('Le nombre d\'elements de piste se vident lorsque l\'on depasse 5.', () => {
    const gestionElementsPiste: GestionElementsPiste = new GestionElementsPiste();
    const nombreElements: number[] = [1, 3, 5, 0];
    const listePosition = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 5, 0),
      new THREE.Vector3(20, 15, 0), new THREE.Vector3(0, 0, 0)];
    for (let i = 0; i < 4; i++) {
      gestionElementsPiste.ajouterElementDePiste(listePosition);
      expect(gestionElementsPiste.obtenirNombreElements()).toBe(nombreElements[i]);
    }

  });
});
