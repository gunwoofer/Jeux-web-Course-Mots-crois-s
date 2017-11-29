import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import { FabriquantElementDePiste } from './FabriquantElementDePiste';

export class ElementDePisteComposite {
    public elementsDePiste: ElementDePiste[] = [];

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

    public retirerTous(type?: TypeElementPiste): void {
        if (type === undefined) {
            this.elementsDePiste = new Array();
        } else {
            const elementsASupprime: ElementDePiste[] = [];
            for (const elementCourant of this.elementsDePiste) {
                console.log('ELEMENTS LENGTH DEBUT i : ' + this.elementsDePiste.length);
                console.log('SPLICE ELEMENT TYPE : ' + type );
                if (FabriquantElementDePiste.estDeType(type, elementCourant)) {
                    elementsASupprime.push(elementCourant);
                }
            }

            for (const elementCourantASupprime of elementsASupprime) {
                for (let noElement = 0; noElement < this.elementsDePiste.length; noElement++) {
                    if (elementCourantASupprime === this.elementsDePiste[noElement]) {
                        this.elementsDePiste.splice(noElement, 1);
                        console.log('SPLICE : ' + noElement);
                    }
                }
            }
        }
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
