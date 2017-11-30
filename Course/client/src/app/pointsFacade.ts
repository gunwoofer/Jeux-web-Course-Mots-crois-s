import { Points } from 'three';

export const listeErreurCouleur = {
    normal: 'green',
    angle45: 'red',
    proche: 'orange',
    premier: 'purple'
};

export class PointsFacade extends Points {
    public status: string;
}
