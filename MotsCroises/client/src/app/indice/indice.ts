export class Indice {
  public id: number;
  public name: string;
  public tailleMot: number;
  public sens: number; // False = horizontal, True = vertical
  public positionI: number;
  public positionJ: number;
  public motTrouve: string;

  constructor(id: number, name: string, tailleMot: number, sens: number, positionI: number, positionJ: number, motTrouve: string = '') {
    this.id = id;
    this.name = name;
    this.tailleMot = tailleMot;
    this.sens = sens;
    this.positionI = positionI;
    this.positionJ = positionJ;
    this.motTrouve = motTrouve;
  }
}
