export class Guid {
    public static generateGUID(): string {
        let d = new Date().getTime();

        // Librairie externe pour générer des GUID.
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // Comme c'est une librairie externe, tslint est supprimé ici.
            // tslint:disable-next-line:no-bitwise
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            // tslint:disable-next-line:no-bitwise
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

        return uuid;
    }

}
