import { adminSchema } from './schemaAdmin';
import mongoose = require('mongoose');
import { Document, Model } from 'mongoose';
import { Administrateur as AdministrateurInterface } from './adminInterface';

export interface AdminModel extends AdministrateurInterface, Document {}

export const modelAdmin = mongoose.model<AdminModel, Model<AdminModel>>('Administrateur', adminSchema);
