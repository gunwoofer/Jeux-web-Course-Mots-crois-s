import { ModificationForm } from './accueil/admin/modificationMotDepasse/modificationModel';
import { Administrateur } from './accueil/admin/admin';
import { NgForm } from '@angular/forms/src/directives/ng_form';

export const mockAdmin = new Administrateur();

export const mockForm = new ModificationForm();

export const mockListAdmin: Administrateur[] = [
    new Administrateur()
];
