import { TestBed, inject } from '@angular/core/testing';
import * as THREE from 'three';
import { RenderService } from './render.service';
import { CreateurPiste } from './createurPiste.component';

describe('RenderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RenderService]
    });
  });

  it('should be created', inject([RenderService], (service: RenderService) => {
    expect(service).toBeTruthy();
  }));

});
