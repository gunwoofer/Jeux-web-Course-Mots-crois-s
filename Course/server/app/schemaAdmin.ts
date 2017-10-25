import { Schema } from 'mongoose';

export const adminSchema: Schema = new Schema({
    nomUtilisateur: { type: String, required: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true },
    motDePasse: { type: String, required: true },
});
