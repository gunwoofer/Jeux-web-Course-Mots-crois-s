import { IPromesseErreur } from "./promesseErreur";

export interface IObjetJson {
    message: string;
    error: IPromesseErreur;
    objet: any;
    motDePasse: string;
}
