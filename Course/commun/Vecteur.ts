import { POSITION_RELIEF_PAR_RAPPORT_Z } from "../client/src/app/constant";

export const POSITION_X_PAR_DEFAUT = 0;
export const POSITION_Y_PAR_DEFAUT = 0;
export const POSITION_Z_PAR_DEFAUT = 0;

export class Vecteur {

  constructor ( public x:number = POSITION_X_PAR_DEFAUT, 
                public y:number = POSITION_Y_PAR_DEFAUT, 
                public z:number = POSITION_Z_PAR_DEFAUT) {}
}
