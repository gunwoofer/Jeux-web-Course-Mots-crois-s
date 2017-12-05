import { IObservateur } from "./Observateur";
import { NotificationType } from "./NotificationType";

export interface ISujet {
    ajouterObservateur(observateur: IObservateur): void;
    supprimerObservateur(observateur: IObservateur): void;
    notifierObservateurs(type: NotificationType): void;
}
