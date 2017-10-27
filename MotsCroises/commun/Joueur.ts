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
    private couleur: Couleur;
    private emplacementMotSelectionner: EmplacementMot;
    private emplacementsMotTrouve: EmplacementMot[] = [];
    private motsDeTrouve: string[] = [];

    constructor(couleur: Couleur = Couleur.Bleu) {
        this.couleur = couleur;
    }

    public obtenirGuid(): string {
        return this.id;
    }

    public aTrouveMot(emplacementMotTrouve: EmplacementMot, motTrouve: string): void {
        this.emplacementsMotTrouve.push(emplacementMotTrouve);
        this.motsDeTrouve.push(motTrouve);
        this.pointage++;
    }

    public obtenirMotTrouve(): string[] {
        return this.motsDeTrouve;
    }
    
    public obtenirPointage(): number {
        return this.pointage;
    }

    public obtenirCouleur(): Couleur {
        return this.couleur;
    }

    public estSelectionner(emplacementMotAVerifier: EmplacementMot): boolean {
        if (this.emplacementMotSelectionner !== undefined) {
            if (this.emplacementMotSelectionner.estPareilQue(emplacementMotAVerifier)) {
                return true;
            }
        }

        return false;
    }

    public selectionnerEmplacementMot(emplacementMotSelectionner: EmplacementMot): void{
        this.emplacementMotSelectionner = emplacementMotSelectionner;
    }

    public nePlusSelectionnerEmplacementMot(): void {
        this.emplacementMotSelectionner = undefined;
    }

    public obtenirEmplacementMotSelectionner(): EmplacementMot {
        return this.emplacementMotSelectionner;
    }
}
