import { Piste } from './piste.model';
import { ElementDePiste } from '../elementsPiste/ElementDePiste';

const listepositions: any[] =
    [{ z: 0, y: 24.003569616469644, x: 101.77079099777208 },
    { z: 0, y: 46.826635809178065, x: 41.17161184536442 },
    { z: 0, y: -34.23459928906337, x: 8.511015289197246 },
    { z: 0, y: -43.28512553789595, x: 99.40978401780862 },
    { z: 0, y: 24.003569616469644, x: 101.77079099777208 }];


const elementDepistes: ElementDePiste[] = [];

export const mockPistes: Piste[] = [
    new Piste('piste1', 'amateur', 'piste1', listepositions, elementDepistes),
    new Piste('piste2', 'amateur', 'piste2', listepositions, elementDepistes),
    new Piste('piste3', 'professionnel', 'piste2', listepositions, elementDepistes)
];
