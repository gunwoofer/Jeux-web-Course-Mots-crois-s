import { Observateur } from './Observateur';
import { NotificationType } from './NotificationType';

export interface Sujet { 
    ajouterObservateur(observateur: Observateur): void;
    supprimerObservateur(observateur: Observateur): void;
    notifierObservateurs(type: NotificationType): void; 
}   