import { ElementDePisteComposite } from './ElementDePisteComposite';
import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import { FlaqueDEau } from './FlaqueDEau';
import { Accelerateur } from './Accelerateur';
import { NidDePoule } from './NidDePoule';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { Vecteur } from '../../../../commun/Vecteur';
import { FabriquantElementDePiste } from './FabriquantElementDePiste';

export class GestionElementsPiste implements Observateur {

    private typeElementPiste: TypeElementPiste = TypeElementPiste.Accelerateur;
    private elementDePisteComposite: ElementDePisteComposite = new ElementDePisteComposite();

    public ajouterElementDePiste(listePosition: THREE.Vector3[]): void {
        if (this.elementDePisteComposite.obtenirNombreElements(this.typeElementPiste) >= 5) {
            this.elementDePisteComposite.retirerTous(this.typeElementPiste);
        } else {
            this.ajouterElementDePisteSelonContraintes(listePosition);
        }
    }

    private ajouterElementDePisteSelonContraintes(listePosition: THREE.Vector3[]): void {
        while (this.elementDePisteComposite.obtenirNombreElements(this.typeElementPiste) < 5) {
            this.elementDePisteComposite.ajouter(FabriquantElementDePiste.creerNouvelleElementPiste(this.typeElementPiste, listePosition));

            if (this.nombreElementsEstImpair()) {
                break;
            }
        }
    }

    public notifier(sujet: Sujet, type: NotificationType): void {
        if (type === NotificationType.PisteOuverte) {
            this.elementDePisteComposite.retirerTous();
        }
    }

    private obtenirAleatoirementPositionSurPiste(): Vecteur {
        return new Vecteur();
    }

    public nombreElementsEstImpair(): boolean {
        return (this.elementDePisteComposite.obtenirNombreElements(this.typeElementPiste) % 2 !== 0) ? true : false;
    }

    public obtenirNombreElements(): number {
        return this.elementDePisteComposite.obtenirNombreElements(this.typeElementPiste);
    }
}
