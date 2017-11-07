import { Observateur } from './Observateur';

export interface Sujet { 
    observateurs: Observateur[];
    ajouterObservateur(observateur: Observateur): void;
    supprimerObservateur(observateur: Observateur): void;
    notifierObservateurs(): void; 
}   