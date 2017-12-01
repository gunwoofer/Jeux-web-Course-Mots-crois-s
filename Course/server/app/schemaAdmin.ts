import { Schema } from 'mongoose';

export const adminSchema: Schema = new Schema({
    nomUtilisateur: { type: String },
    nom: { type: String},
    prenom: { type: String },
    email: { type: String },
    motDePasse: { type: String},
});
