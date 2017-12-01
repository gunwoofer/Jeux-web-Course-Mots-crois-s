export const NOM_MOTEUR = 'moteur1';
export const NOM_BOOST = 'boost';
export const NOM_OBSTACLE = 'obstacle';

const EMPLACEMENT_MUSIQUE = '../../assets/effetsSonores/';
const FORMAT_MP3 = '.mp3';

export class EffetSonore {

    private musique: HTMLAudioElement;
    private enEcoute = false;

    public static jouerUnEffetSonore(NOM_EFFET_SONORE: string, loop: boolean = false): void {
        new EffetSonore().lancerEffetSonore(NOM_EFFET_SONORE, loop);
    }

    public arreterMusique(): void {
        if (this.enEcoute) {
            this.musique.pause();
            this.enEcoute = false;
        }
    }

    public lancerEffetSonore(NOM_MUSIQUE: string, loop: boolean = false): void {
        this.musique = this.chargerEffetSonore(NOM_MUSIQUE, loop);
        this.lancerMusique();
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
}
