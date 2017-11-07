import { Sujet } from './Sujet';

export interface Observateur {
    notifier(sujet: Sujet): void;
}