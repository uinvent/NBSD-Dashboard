import { TestBed, inject } from '@angular/core/testing';
import { StationService } from './../index';
import { NYBSInfo } from '../../models/index';
import {} from 'jasmine';

describe('LogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StationService]
    });
  });

  it('should be created', inject([StationService], (service: StationService) => {
    expect(service).toBeTruthy();
  }));
});
