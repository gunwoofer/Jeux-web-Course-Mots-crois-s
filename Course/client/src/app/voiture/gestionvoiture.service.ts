import { Injectable } from '@angular/core';
import { LumiereService } from '../lumiere/lumiere.service';
import { Voiture } from './Voiture';

@Injectable()
export class GestionVoitureService {

    public logiquePhares(voiture: Voiture): void {
        if (!LumiereService.phares && LumiereService.jour) {
            LumiereService.phares = !LumiereService.phares;
            LumiereService.alternerPhares(voiture);
        } else if (LumiereService.phares && !LumiereService.jour) {
            LumiereService.phares = !LumiereService.phares;
            LumiereService.alternerPhares(voiture);
        }
    }

}