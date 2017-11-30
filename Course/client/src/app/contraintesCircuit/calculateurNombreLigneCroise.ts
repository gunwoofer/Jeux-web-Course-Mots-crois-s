

export class CalculateurNombreLigneCroise {

    public nombreLignesCroisees(points: any[], dessinTermine: boolean): number {
        let nbSegmentsCroises = 0;
        for (let point1 = 0; point1 < points.length; point1++) {
            for (let point2 = point1 + 1; point2 < points.length - 1; point2++) {
                if (this.segmentsCoises(point1, point2, points, dessinTermine)) {
                    nbSegmentsCroises++;
                }
            }
        }
        return nbSegmentsCroises;
    }

    private segmentsCoises(i: number, j: number, points: any[], dessinTermine: boolean): boolean {
        const pointA = points[i];
        const pointB = points[i + 1];
        const pointC = points[j];
        const pointD = points[j + 1];
        const vectAB = [pointB.position.x - pointA.position.x, pointB.position.y - pointA.position.y];
        const vectAC = [pointC.position.x - pointA.position.x, pointC.position.y - pointA.position.y];
        const vectAD = [pointD.position.x - pointA.position.x, pointD.position.y - pointA.position.y];
        const vectCA = vectAC.map(function (x) { return x * -1; });
        const vectCB = [pointB.position.x - pointC.position.x, pointB.position.y - pointC.position.y];
        const vectCD = [pointD.position.x - pointC.position.x, pointD.position.y - pointC.position.y];

        if (this.obtenirSigneDuDeterminant(vectAB, vectAC) === 0 || this.obtenirSigneDuDeterminant(vectCD, vectCB) === 0) {
            return false;
        } else if (this.obtenirSigneDuDeterminant(vectAB, vectAC) !== this.obtenirSigneDuDeterminant(vectAB, vectAD) &&
            this.obtenirSigneDuDeterminant(vectCD, vectCB) !== this.obtenirSigneDuDeterminant(vectCD, vectCA)) {
            if ((dessinTermine) && (vectAD[0] === 0 && vectAD[1] === 0)) {
                return false;
            }

            return true;
        }

        return false;
    }

    private obtenirSigneDuDeterminant(vecteurA: number[], vecteurB: number[]): number {
        return Math.sign(this.obtenirDeterminant(vecteurA, vecteurB));
    }

    private obtenirDeterminant(vecteurA: number[], vecteurB: number[]): number {
        return vecteurA[0] * vecteurB[1] - vecteurA[1] * vecteurB[0];
    }
}
