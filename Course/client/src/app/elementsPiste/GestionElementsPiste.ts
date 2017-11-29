import { ElementDePisteComposite } from './ElementDePisteComposite';
import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { FabriquantElementDePiste } from './FabriquantElementDePiste';

export class GestionElementsPiste implements Observateur {
    public elementDePisteComposite: ElementDePisteComposite = new ElementDePisteComposite();

    public ajouterElementDePiste(listePosition: THREE.Vector3[], typeElement: TypeElementPiste): void {
        if (this.elementDePisteComposite.obtenirNombreElements(typeElement) >= 5) {
            this.elementDePisteComposite.retirerTous(typeElement);
        } else {
            this.ajouterElementDePisteSelonContraintes(listePosition, typeElement);
        }
    }

    private ajouterElementDePisteSelonContraintes(listePosition: THREE.Vector3[], typeElement: TypeElementPiste): void {
        while (this.elementDePisteComposite.obtenirNombreElements(typeElement) < 5) {
            this.elementDePisteComposite.ajouter(FabriquantElementDePiste.creerNouvelleElementPiste(typeElement, listePosition));

            if (this.nombreElementsEstImpair(typeElement)) {
                break;
            }
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
}
