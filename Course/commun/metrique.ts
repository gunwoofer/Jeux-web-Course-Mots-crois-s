export class Metrique {

    public static convertirEnSecondes(millisecondes: number): number {
        return Math.pow(10, -3) * millisecondes;
    }

}
