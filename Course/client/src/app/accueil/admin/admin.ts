import { NgForm } from '@angular/forms/src/directives/ng_form';

export class Administrateur {

    public email: string;
    public motDePasse: string;
    public nomUtilisateur?: string;
    public nom?: string;
    public prenom?: string;

    constructor (form?: NgForm) {
        if (form !== undefined) {
            this.email = form.value.email;
            this.motDePasse = form.value.motDePasse;
            this.nomUtilisateur = form.value.nomUtilisateur;
            this.nom = form.value.nom;
            this.prenom = form.value.prenom;
        } else {
            this.preparerMock();
        }
    }

    public obtenirMotDePasse(): string {
        return this.motDePasse;
    }

    public obtenirEmail(): string {
        return this.email;
    }

    private preparerMock(): void {
        this.email = 'john.Doe@gmail.com';
        this.motDePasse = 'Hello';
        this.nomUtilisateur = 'a-7';
        this.nom = 'Doe';
        this.prenom = 'John';
    }
}
