
import { TypeElementPiste, ElementDePiste } from './ElementDePiste';
import { Accelerateur } from './Accelerateur';
import { FlaqueDEau } from './FlaqueDEau';
import { NidDePoule } from './NidDePoule';
import * as THREE from 'three';

export class FabriquantElementDePiste {

    public static rehydrater(source: ElementDePiste, listePosition: THREE.Vector3[]): ElementDePiste {
        const sourceElementDePiste = source as ElementDePiste;
        let vraiElementDePiste: ElementDePiste;

        vraiElementDePiste = FabriquantElementDePiste.creerNouvelleElementPiste(source.typeElementDePiste, listePosition,
            source.position);

        Object.assign(vraiElementDePiste, sourceElementDePiste);

        return vraiElementDePiste;
    }

    public static creerNouvelleElementPiste(typeElementPiste: TypeElementPiste, listePosition: THREE.Vector3[],
        position?: THREE.Vector3): ElementDePiste {
        return FabriquantElementDePiste.creationElement(typeElementPiste, listePosition, position);
    }

    public static estDeType(type: TypeElementPiste, elementAVerifier: ElementDePiste): boolean {
        if (type === TypeElementPiste.Accelerateur && elementAVerifier instanceof Accelerateur ||
            type === TypeElementPiste.FlaqueDEau && elementAVerifier instanceof FlaqueDEau ||
            type === TypeElementPiste.NidDePoule && elementAVerifier instanceof NidDePoule) {
            return true;
        }

        return false;
    }

    public static creationElement(typeElementPiste: TypeElementPiste, listePosition: THREE.Vector3[],
        position?: THREE.Vector3): ElementDePiste {
        if (typeElementPiste === TypeElementPiste.Accelerateur) {
            return new Accelerateur(listePosition, position);
        }

        if (typeElementPiste === TypeElementPiste.FlaqueDEau) {
            return new FlaqueDEau(listePosition, position);
        }

        if (typeElementPiste === TypeElementPiste.NidDePoule) {
            return new NidDePoule(listePosition, position);
        }
    }
}
