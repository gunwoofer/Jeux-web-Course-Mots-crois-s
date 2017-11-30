
import { TypeElementPiste, ElementDePiste} from './ElementDePiste';
import { Accelerateur } from './Accelerateur';
import { FlaqueDEau } from './FlaqueDEau';
import { NidDePoule } from './NidDePoule';
import { Vecteur } from '../../../../commun/Vecteur';
import * as THREE from 'three';

export class FabriquantElementDePiste {
  public static creerNouvelleElementPiste(typeElementPiste: TypeElementPiste, position: Vecteur): ElementDePiste {
      if (typeElementPiste === TypeElementPiste.Accelerateur) {
          return new Accelerateur(new THREE.Vector3(position.x, position.y, position.z));
      }
      if (typeElementPiste === TypeElementPiste.FlaqueDEau) {
          return new FlaqueDEau(new THREE.Vector3(position.x, position.y, position.z));
      }
      if (typeElementPiste === TypeElementPiste.NidDePoule) {
          return new NidDePoule(new THREE.Vector3(position.x, position.y, position.z));
      }
  }

  public static estDeType(type: TypeElementPiste, elementAVerifier: ElementDePiste): boolean {
      if (type === TypeElementPiste.Accelerateur && elementAVerifier instanceof Accelerateur) {
          return true;
      } else if (type === TypeElementPiste.FlaqueDEau && elementAVerifier instanceof FlaqueDEau) {
          return true;
      } else if (type === TypeElementPiste.NidDePoule && elementAVerifier instanceof NidDePoule) {
          return true;
      }

      return false;
  }
}
