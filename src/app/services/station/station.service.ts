import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NYBSInfo, NYBSStatus } from '../../models/index';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
import { CoreService } from '../core/core.service';
import { StationApiUrls } from '../core/apiUrls.enum';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


@Injectable()
export class StationService extends CoreService {

  public getnybsInfo(): Observable<NYBSInfo> {
    return this.getAll(StationApiUrls.getStationInfo).map(this.extractData);
  }

  public getAllSationsStatus(): Observable<NYBSStatus> {
    return this.getAll(StationApiUrls.getStationStatus).map(this.extractData);
  }
}
