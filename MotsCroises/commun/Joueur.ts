import { Guid } from './Guid';

enum Couleur {
    Rouge,
    Vert,
    Bleu
}

export class Joueur {
    private id: string = Guid.generateGUID();
    private pointage = 0;
    private couleur: Couleur;

    constructor(couleur: Couleur = Couleur.Bleu) {
        this.couleur = couleur;
    }

    public obtenirGuid(): string {
        return this.id;
    }

    public aTrouveMot() {
        this.pointage++;
    }

    public obtenirPointage(): number {
        return this.pointage;
    }

    public obtenirCouleur(): Couleur {
        return this.couleur;
    }
}
