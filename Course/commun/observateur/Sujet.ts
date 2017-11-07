import { Observateur } from './Observateur';

export interface Sujet { 
    ajouterObservateur(observateur: Observateur): void;
    supprimerObservateur(observateur: Observateur): void;
    notifierObservateurs(): void; 
}   