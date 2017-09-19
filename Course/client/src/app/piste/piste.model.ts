import * as THREE from 'three';


export class Piste {
    constructor(private nom: string,
                private typeCourse: string,
                private description: string,
                private listePoints?: THREE.Points[],
                private listeLignes?: THREE.Line[]) {
    }

    public obtenirNom(): string {
        return this.nom;
    }

    public obtenirTypeCourse(): string {
        return this.typeCourse;
    }

    public obtenirDescription(): string {
        return this.description;
    }

    public modifierNom(nom: string) {
        this.nom = nom;
    }

    public modifierTypeCourse(type: string) {
        this.typeCourse = type;
    }

    public modifierDescription(description: string) {
        this.description = description;
    }

}
