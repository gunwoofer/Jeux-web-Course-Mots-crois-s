import { NgForm } from '@angular/forms/src/directives/ng_form';

export class ModificationForm {

    private email: string;
    private ancienMotDpass: string;
    private nouveauMotDpass: string;

    constructor(form?: NgForm) {
        if (form !== undefined) {
            this.email = form.value.email;
            this.ancienMotDpass = form.value.ancienMotDpass;
            this.nouveauMotDpass = form.value.nouveauMotDpass;
        } else {
            this.genererMock();
        }
    }

    private genererMock() {
        this.email = 'john.Doe@gmail.com';
        this.ancienMotDpass = 'Hello';
        this.nouveauMotDpass = 'HALLO';
    }
}
