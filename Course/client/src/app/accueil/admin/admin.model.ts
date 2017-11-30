export class Administrateur {

    constructor(public email: string,
        public motDePasse: string,
        public nomUtilisateur?: string,
        public nom?: string,
        public prenom?: string) { }
}
