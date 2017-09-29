import { Partie } from './Partie';
import { Guid } from './Guid';
import { Mot } from './Mot';

enum Couleur {
    Rouge,
    Vert,
    Bleu
}

export class Joueur {
    private partie: Partie;
    private id: Guid;
    private pointage: number;
    private motTrouves: Mot;
    private couleur: Couleur;

}