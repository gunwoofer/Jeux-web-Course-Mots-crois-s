import { Sujet } from './Sujet';
import { NotificationType } from './NotificationType';

export interface Observateur {
    notifier(sujet: Sujet, type: NotificationType): void;
}