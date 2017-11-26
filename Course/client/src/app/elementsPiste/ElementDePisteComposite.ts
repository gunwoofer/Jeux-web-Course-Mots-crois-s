import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import { FabriquantElementDePiste } from './FabriquantElementDePiste';

export class ElementDePisteComposite {
    private elementsDePiste: ElementDePiste[] = [];

    constructor(elementsDePiste?: ElementDePiste[] ) {
        if (elementsDePiste !== undefined) {
            for (const elementDePisteCourant of elementsDePiste){
                this.ajouter(elementDePisteCourant);
            }
        }
    }

    public ajouter(elementDePiste: ElementDePiste): void {
        this.elementsDePiste.push(elementDePiste);
    }

    public retirer(elementDePiste: ElementDePiste): void {
        for (let i = 0; i < this.elementsDePiste.length; i++) {
            if (this.elementsDePiste[i] === elementDePiste) {
                this.elementsDePiste.splice(i, 1);
            }
        }
    }

    public retirerTous(): void {
        this.elementsDePiste = new Array();
    }

    public obtenirEnfant(index: number): ElementDePiste {
        return this.elementsDePiste[index];
    }

    public obtenirNombreElements(type?: TypeElementPiste): number {
        if (type === undefined) {
            return this.elementsDePiste.length;
        }

        let compteur = 0;

        for (const elementDePisteCourant of this.elementsDePiste) {
            compteur += (FabriquantElementDePiste.estDeType(type, elementDePisteCourant)) ? 1 : 0;
        }

        return compteur;
    }

}
