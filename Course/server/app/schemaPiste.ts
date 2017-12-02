import { Schema } from 'mongoose';

export const pisteSchema: Schema = new Schema({
  createdAt: { type: Date, default: Date.now },
  nom: { type: String },
  typeCourse: { type: String },
  description: { type: String },
  vignette: { type: String },
  nombreFoisJouee: { type: Number },
  coteMoyenne: { type: Number },
  coteAppreciation: { type: [] },
  listeElementsDePiste: { type: [] },
  meilleursTemps: { type: [] },
  listepositions: { type: [] },
});
