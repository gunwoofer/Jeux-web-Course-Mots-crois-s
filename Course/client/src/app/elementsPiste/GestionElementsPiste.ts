import { FonctionMaths } from './../fonctionMathematiques';
import { ElementDePisteComposite } from './ElementDePisteComposite';
import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { FabriquantElementDePiste } from './FabriquantElementDePiste';
import { MAXIMUM_OBSTACLES_PAR_TYPE } from '../constant';

const MINIMUM_DISTANCE_OBSTACLE_DIFFERENT = 10;

export class GestionElementsPiste implements Observateur {
    public elementDePisteComposite: ElementDePisteComposite = new ElementDePisteComposite();

    public ajouterElementDePiste(listePosition: THREE.Vector3[], typeElement: TypeElementPiste): void {
        if (this.elementDePisteComposite.obtenirNombreElements(typeElement) >= MAXIMUM_OBSTACLES_PAR_TYPE) {
            this.elementDePisteComposite.retirerTous(typeElement);
        } else {
            this.ajouterElementDePisteSelonContraintes(listePosition, typeElement);
        }
    }

    public obtenirListeElement(): ElementDePiste[] {
        return this.elementDePisteComposite.elementsDePiste;
    }

    public notifier(sujet: Sujet, type: NotificationType): void {
        if (type === NotificationType.PisteOuverte) {
            this.elementDePisteComposite.retirerTous();
        }
    }

    public nombreElementsEstImpair(typeElement: TypeElementPiste): boolean {
        return (this.elementDePisteComposite.obtenirNombreElements(typeElement) % 2 !== 0) ? true : false;
    }

    public obtenirNombreElementsType(typeElement: TypeElementPiste): number {
        return this.elementDePisteComposite.obtenirNombreElements(typeElement);
    }

    public obtenirNombreElement(): number {
        return this.elementDePisteComposite.elementsDePiste.length;
    }

    public changerPositionType(typeElement: TypeElementPiste, listePosition: THREE.Vector3[]): void {
        for (let i = 0; i < this.obtenirNombreElement(); i++) {
            if (this.obtenirListeElement()[i].typeElementDePiste === typeElement) {
                this.obtenirListeElement().splice(i, 1);
                this.ajouterElementDePisteSelonContraintes(listePosition, typeElement);
            }
        }
    }

    private ajouterElementDePisteSelonContraintes(listePosition: THREE.Vector3[], typeElement: TypeElementPiste): void {
        while (this.elementDePisteComposite.obtenirNombreElements(typeElement) < MAXIMUM_OBSTACLES_PAR_TYPE) {
            let elementAAjouter;
            do {
                elementAAjouter = FabriquantElementDePiste.creerNouvelleElementPiste(typeElement, listePosition);
             } while (this.chevaucheUnElementAutreType(elementAAjouter.position, typeElement));
            this.elementDePisteComposite.ajouter(elementAAjouter);
            if (this.nombreElementsEstImpair(typeElement)) {
                break;
            }
        }
    }

    private chevaucheUnElementAutreType(positionAVerifier: THREE.Vector3, typeElement: TypeElementPiste): boolean {
        for (const element of this.elementDePisteComposite.elementsDePiste) {
            if (element.typeElementDePiste !== typeElement) {
                if (FonctionMaths.DeuxPositionTropProche(positionAVerifier,
                                                         element.position,
                                                         MINIMUM_DISTANCE_OBSTACLE_DIFFERENT)) {
                    return true;
                }
            }
        }
        return false;
    }
}
