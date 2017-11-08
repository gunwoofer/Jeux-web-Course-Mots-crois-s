import { Musique } from './../musique/musique.model';
import { Segment } from './segment.model';
import { Injectable } from '@angular/core';
@Injectable()
export class SegmentService {
    public segment: Segment;
    public centre: Segment;
    public premierSegment : Segment;
    

    constructor () {
        this.premierSegment = new Segment;
        this.segment = new Segment;
    }
}