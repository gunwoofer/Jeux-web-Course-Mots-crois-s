const EMPLACEMENT_MUSIQUE = '../../assets/musiques/';
const FORMAT_MP3 = '.mp3';

export class Musique {
    private musique: HTMLAudioElement;
    private duree: number;
    private enEcoute: boolean;

    constructor() {
        this.enEcoute = false;
    }

    private chargerMusique(nom: string): HTMLAudioElement {
        const musique = new Audio(EMPLACEMENT_MUSIQUE + nom + FORMAT_MP3);
        return musique;
    }

    private lancerMusique(): void {
        if (this.musique.currentTime === 0 && !this.enEcoute) {
            this.musique.play();
            this.enEcoute = true;
        }
    }

    public arreterMusique(): void {
        this.musique.pause();
        this.enEcoute = false;
    }

    public lancerMusiqueThematique(): void {
        this.musique = this.chargerMusique('Get The New World');
        this.musique.loop = true;
        this.duree = 92;
        this.lancerMusique();
    }
}
