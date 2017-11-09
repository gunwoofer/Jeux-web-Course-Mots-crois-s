import { Piste } from './../piste/piste.model';
import { Score } from './Score.model';

export const mockTableauScore = [
    new Score('Stephanie', '4min10s', null),
    new Score('Jonathan', '5min10s', null),
    new Score('Anas', '2min10s', null),
    new Score('Daniel', '3min40s', null),
    new Score('Jonathan', '5min20s', null)
];

const listepositions: any[] =
[{ z: 0, y: 24.003569616469644, x: 101.77079099777208 },
{ z: 0, y: 46.826635809178065, x: 41.17161184536442 },
{ z: 0, y: -34.23459928906337, x: 8.511015289197246 },
{ z: 0, y: -43.28512553789595, x: 99.40978401780862 },
{ z: 0, y: 24.003569616469644, x: 101.77079099777208 }];

export const scoreMock = new Score('Younes', '3min10s', 3);

export const pisteMock = new Piste('piste1', 'amateur', 'piste izi', listepositions);


