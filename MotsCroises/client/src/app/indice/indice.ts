export class IndiceMot {
  public indexFixe: number;
  public definition: string;
  public GuidIndice: string;
  public tailleMot: number;
  public sens: number; // False = horizontal, True = vertical
  public positionI: number;
  public positionJ: number;
  public motTrouve: string;

  constructor(guidIndice: string, indexFixe: number, definition: string, tailleMot: number, sens: number, positionI: number, positionJ: number, motTrouve: string = '') {
    this.GuidIndice = guidIndice;
    this.indexFixe = indexFixe;
    this.definition = definition;
    this.tailleMot = tailleMot;
    this.sens = sens;
    this.positionI = positionI;
    this.positionJ = positionJ;
    this.motTrouve = motTrouve;
  }
}
