import { Partie } from './Partie';
import { Guid } from './Guid';
import { EmplacementMot } from './EmplacementMot';

enum Couleur {
    Rouge,
    Vert,
    Bleu
}

export class Joueur {
    private id: string = Guid.generateGUID();
    private pointage = 0;
    private emplacementMotsTrouves: EmplacementMot[] = new Array();
    private couleur: Couleur;

    constructor(couleur: Couleur = Couleur.Bleu) {

    }

    public obtenirGuid(): string {
        return this.id;
    }

    public aTrouveMot(emplacementMot: EmplacementMot) {
        this.pointage++;
        this.emplacementMotsTrouves.push(emplacementMot);
    }

    public obtenirPointage(): number {
        return this.pointage;
    }

    public obtenirCouleur(): Couleur {
        return this.couleur;
    }
}
