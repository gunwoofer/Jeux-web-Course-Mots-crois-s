import { Piste } from './../piste/piste.model';
import { Score } from './Score.model';

export const mockTableauScore = [
    new Score('Stephanie', '4min10s', null),
    new Score('Jonathan', '5min10s', null),
    new Score('Anas', '2min10s', null),
    new Score('Daniel', '3min40s', null),
    new Score('Jonathan', '5min20s', null)
];

export const scoreMock = new Score('Younes', '3min10s', 3);

export const pisteMock = new Piste('piste1', 'amateur', 'piste izi', null);
