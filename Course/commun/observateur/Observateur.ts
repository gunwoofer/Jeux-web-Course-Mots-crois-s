import { ISujet } from "./Sujet";
import { NotificationType } from "./NotificationType";

export interface IObservateur {
    notifier(sujet: ISujet, type: NotificationType): void;
}