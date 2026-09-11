import { TestBed } from '@angular/core/testing';

import { BiometriaDomainService } from './biometria-domain.service';

describe('BiometriaDomainService', () => {
  let service: BiometriaDomainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiometriaDomainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
