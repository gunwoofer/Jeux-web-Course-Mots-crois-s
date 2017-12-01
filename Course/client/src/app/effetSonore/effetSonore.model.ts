const EMPLACEMENT_MUSIQUE = '../../assets/effetsSonores/';
const FORMAT_MP3 = '.mp3';
export const NOM_MOTEUR = 'moteur1';
export const NOM_BOOST = 'boost';
export const NOM_OBSTACLE = 'obstacle';


export class EffetSonore {
    private musique: HTMLAudioElement;
    private enEcoute: boolean;
    public thematique: boolean;

    constructor() {
        this.enEcoute = false;
        this.thematique = false;
    }

    private chargerEffetSonore(nom: string, loop: boolean = false): HTMLAudioElement {
        const musique = new Audio(EMPLACEMENT_MUSIQUE + nom + FORMAT_MP3);
        musique.loop = loop;
        return musique;
    }

    private lancerMusique(): void {
        if (!this.enEcoute) {
            this.musique.play();
            this.enEcoute = true;
        }
    }

    public arreterMusique(): void {
        if (this.enEcoute) {
            this.musique.pause();
            this.enEcoute = false;
            this.thematique = false;
        }
    }

  public lancerEffetSonore(NOM_MUSIQUE: string, loop: boolean = false): void {
    this.musique = this.chargerEffetSonore(NOM_MUSIQUE, loop);
    this.lancerMusique();
  }
}
