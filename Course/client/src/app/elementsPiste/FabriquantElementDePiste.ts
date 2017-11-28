
import { TypeElementPiste, ElementDePiste} from './ElementDePiste';
import { Accelerateur } from './Accelerateur';
import { FlaqueDEau } from './FlaqueDEau';
import { NidDePoule } from './NidDePoule';
import { Vecteur } from '../../../../commun/Vecteur';
import * as THREE from 'three';

export class FabriquantElementDePiste {
  public static creerNouvelleElementPiste(typeElementPiste: TypeElementPiste, listePosition: THREE.Vector3[]): ElementDePiste {
      if (typeElementPiste === TypeElementPiste.Accelerateur) {
          return new Accelerateur(listePosition);
      }
      if (typeElementPiste === TypeElementPiste.FlaqueDEau) {
          return new FlaqueDEau(listePosition);
      }
      if (typeElementPiste === TypeElementPiste.NidDePoule) {
          return new NidDePoule(listePosition);
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
