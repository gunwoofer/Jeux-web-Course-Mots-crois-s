import { NID_DE_POULE, FLAQUE, ACCELERATEUR, IMAGE_PNG } from './../constant';
import { CreateurPisteService } from './../createurPiste/createurPiste.service';
import { GestionElementsPiste } from './../elementsPiste/GestionElementsPiste';
import { TypeElementPiste } from './../elementsPiste/ElementDePiste';
import { NgForm } from '@angular/forms';
import { Component, Input } from '@angular/core';

import { Piste } from '../piste/piste.model';
import { PisteService } from './../piste/piste.service';
import { MoteurEditeurPiste } from '../moteurEditeurPiste/moteurediteurpiste.service';

@Component({
    selector: 'app-pistevalidator-component',
    templateUrl: './pisteValidation.component.html',
    styleUrls: ['./pisteValidation.component.css']
})

export class PisteValidationComponent {

    public gestionElementsPiste: GestionElementsPiste;

    constructor(private pisteService: PisteService,
        private renderService: MoteurEditeurPiste,
        private createurPisteService: CreateurPisteService) {
        this.gestionElementsPiste = new GestionElementsPiste();
    }

    @Input() public pisteAmodifier: Piste;
    public display: boolean;

    public onSubmit(form: NgForm): void {
        const listepositions: THREE.Vector3[] = [];
        Object.assign(listepositions, this.createurPisteService.obtenirPositions());
        const urlVignette = this.renderService.obtenirRenderer().domElement.toDataURL(IMAGE_PNG);
        if (this.pisteAmodifier) {
            this.modification(this.pisteAmodifier, form, listepositions, urlVignette);
        } else {
            this.creerPiste(form, listepositions, urlVignette);
        }
        this.renderService.reinitialiserScene();
        form.resetForm();
    }
    public onClick(): void {
        this.display = !this.display;
    }

    public ajouterElementDePiste(typeElement): void {
        const type = this.detecterTypeElement(typeElement);
        this.gestionElementsPiste.ajouterElementDePiste(this.createurPisteService.obtenirPositions(), type);
        this.createurPisteService.afficherElementsDePiste(this.gestionElementsPiste.obtenirListeElement(), this.renderService.scene);
    }

    public repositionnerElements(typeElement): void {
        const type = this.detecterTypeElement(typeElement);
        this.gestionElementsPiste.changerPositionType(type, this.createurPisteService.obtenirPositions());
        this.createurPisteService.afficherElementsDePiste(this.gestionElementsPiste.obtenirListeElement(), this.renderService.scene);
    }

    private detecterTypeElement(typeElementHtml): TypeElementPiste {
        let type: TypeElementPiste;
        switch (typeElementHtml.target.name) {
            case NID_DE_POULE: { type = TypeElementPiste.NidDePoule; break; }
            case FLAQUE: { type = TypeElementPiste.FlaqueDEau; break; }
            case ACCELERATEUR: { type = TypeElementPiste.Accelerateur; break; }
        }
        return type;
    }

    private modification(piste: Piste, form: NgForm, listePositions: THREE.Vector3[], urlVignette: string): void {
        if (piste.nom === form.value.nomPiste) {
            this.modifierPiste(piste, form, listePositions);
        } else {
            this.creerPiste(form, listePositions, urlVignette);
        }
    }

    private creerPiste(form: NgForm, listePositions: THREE.Vector3[], urlVignette: string): void {
        const piste = new Piste(form.value.nomPiste,
            form.value.typeCourse,
            form.value.description,
            listePositions,
            this.gestionElementsPiste.obtenirListeElement());
        piste.vignette = urlVignette;
        this.pisteService.ajouterPiste(piste)
            .then(reponse => console.log(reponse));
    }

    private modifierPiste(piste: Piste, form: NgForm, listePositions: THREE.Vector3[]): void {
        piste.modifierAttribut(form, listePositions);
        this.pisteService.mettreAjourPiste(piste)
            .then(reponse => console.log(reponse));
    }

}
