export class EnumUtilitaires {

    public static chaine_de_caractere_depuis_enum(enumArray: any, value: number): string {
        for (let k in enumArray) {
            if (enumArray[k] === value) {
                return k;
            }
        }
        return null;
    }
}