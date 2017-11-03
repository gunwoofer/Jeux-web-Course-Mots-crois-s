export class RequisPourMotsTrouve {
    public guidPartie: string;
    public motsTrouveSelonJoueur:Object;

    /*
        EXEMPLE DE STRUCTURE:

        {
            "017498638463" : [
                "bidon",
                "bible",
                "chat"
            ]

            "098749730579360" : [
                "animal"
            ]
        }
    */   
    constructor (guidPartie: string) {
        this.guidPartie = guidPartie;
    } 
}