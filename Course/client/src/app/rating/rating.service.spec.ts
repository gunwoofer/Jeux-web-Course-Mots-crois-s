// import { RatingService } from './rating.service';
// import { TestBed, inject } from '@angular/core/testing';
// import { BaseRequestOptions, Response, ResponseOptions, Http, HttpModule } from '@angular/http';
// import { MockBackend, MockConnection } from '@angular/http/testing';

// describe('utilisateurService', () => {
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 RatingService,
//                 MockBackend,
//                 BaseRequestOptions,
//                 {
//                     provide: Http,
//                     useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
//                         return new Http(backend, defaultOptions);
//                     },
//                     deps: [MockBackend, BaseRequestOptions],
//                 },
//             ],
//             imports: [HttpModule]
//         });
//     });

//     it('Rating service est cree', inject([RatingService], (service: RatingService) => {
//         expect(service).toBeTruthy();
//     }));
// });
