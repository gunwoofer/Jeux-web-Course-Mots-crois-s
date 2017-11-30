import { PromesseErreur } from "./promesseErreur";

export interface objetJson {
    message: string;
    error: PromesseErreur;
    objet: any;
    motDePasse: string;
    
}