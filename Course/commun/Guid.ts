export class Guid {
    public static generateGUID(): string {
        let d: number = new Date().getTime();

        // librairie externe pour générer des GUID.
        const uuid: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            // tslint:disable-next-line:no-bitwise
            const r: number = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            // tslint:disable-next-line:no-bitwise
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });

        return uuid;
    }

}
