const EMPLACEMENT_MUSIQUE = '../../assets/musiques/';
const FORMAT_MP3 = '.mp3';

export class Musique {
    private musique: HTMLAudioElement;
    private duree: number;

    constructor() {}

    private chargerMusique(nom: string): HTMLAudioElement {
        const musique = new Audio(EMPLACEMENT_MUSIQUE + nom + FORMAT_MP3);
        return musique;
    }

    private lancerMusique(): void {
        if (this.musique.currentTime === 0) {
            this.musique.play();
        }
    }

    public lancerMusiqueThematique(): void {
        this.musique = this.chargerMusique('Get The New World');
        this.musique.loop = true;
        this.duree = 92;
        this.lancerMusique();
    }
}
