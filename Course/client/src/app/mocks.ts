import { ModificationForm } from './accueil/admin/modificationMotDepasse/modificationModel';
import { Administrateur } from './accueil/admin/admin.model';



export const mockAdmin = new Administrateur('john.Doe@gmail.com', 'Hello', 'a-7', 'Doe', 'John');

export const mockForm = new ModificationForm('john.Doe@gmail.com', 'Hello', 'HALLO');

export const mockListAdmin: Administrateur[] = [
    new Administrateur('john.Doe@gmail.com', 'Hello', 'a-7', 'Doe', 'John')
];
