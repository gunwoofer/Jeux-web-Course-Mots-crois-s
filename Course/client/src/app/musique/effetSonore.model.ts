import { Observateur } from '../../../../commun/observateur/Observateur';
import { Sujet } from '../../../../commun/observateur/Sujet';
const EMPLACEMENT_MUSIQUE = '../../assets/musiques/';
const FORMAT_MP3 = '.mp3';
export const NOM_THEMATIQUE = 'Get The New World';
const NOM_EDITEUR = 'Sims - Building Mode 3';
const NOM_COURSE = 'The Legend of Zelda Ocarina of Time - Gerudo Valley';
const NOM_STINGER = 'Zelda - Ocarina of Time - Treasure Chest 1';
const DEBUT_STINGER = 8;
export const DUREE_STINGER = 12;

export enum EtatMusique {
    enAttente,
    enCoursPartie,
    enCoursArrivee
}

export class EffetSonore implements Observateur {
    private musique: HTMLAudioElement;
    private enEcoute: boolean;
    private etatMusique: EtatMusique = EtatMusique.enAttente;
    public thematique: boolean;

    constructor() {
        this.enEcoute = false;
        this.thematique = false;
    }

    private chargerEffetSonore(nom: string): HTMLAudioElement {
        const musique = new Audio(EMPLACEMENT_MUSIQUE + nom + FORMAT_MP3);
        //musique.loop = true;
        alert(musique.duration);
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

    public lancerMusiqueThematique(): void {
        this.musique = this.chargerEffetSonore(NOM_THEMATIQUE);
        this.lancerMusique();
        this.thematique = true;
    }

    public lancerMusiqueEditeur(): void {
        this.musique = this.chargerEffetSonore(NOM_EDITEUR);
        this.lancerMusique();
    }

    public lancerMusiqueCourse(): void {
        this.musique = this.chargerEffetSonore(NOM_COURSE);
        this.lancerMusique();
    }

    public lancerStinger(): void {
        this.musique = this.chargerEffetSonore(NOM_STINGER);
        this.musique.loop = false;
        this.musique.currentTime = DEBUT_STINGER;
        this.lancerMusique();
    }

    public conditionStinger(): void {
        if (this.musique.currentTime > DUREE_STINGER) {
            this.arreterMusique();
            this.lancerMusiqueThematique();
        }
    }

    public notifier(sujet: Sujet): void {
        switch (this.etatMusique) {
            case EtatMusique.enAttente :
                // Debut
                this.lancerMusiqueCourse();
                this.etatMusique = EtatMusique.enCoursPartie;
            break;

            case EtatMusique.enCoursPartie :
                // Arrive
                this.arreterMusique();
                this.lancerStinger();
                this.etatMusique = EtatMusique.enCoursArrivee;
            break;
        }
    }

  public lancerEffetSonore(NOM_MUSIQUE: string): void {
    this.musique = this.chargerEffetSonore(NOM_MUSIQUE);
    this.lancerMusique();
  }
}
