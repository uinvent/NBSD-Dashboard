import { Inject, Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import * as _ from 'pako';
import { environment } from '../../../environments/environment';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

@Injectable()
export class CoreService {

    public spinnerCounter = 0;
    private promptMessage = 'Default Message';
    private disposableModal: any;

    constructor(protected _http: Http) {
    }
    protected getAll = (url: string, showSpinner: boolean = true): Observable<Response> => {
      if (showSpinner) { this.addSpinner(); }
      return this._http.get(environment.apiEndpoint + encodeURI(url));
    }
    protected extractData = (res: Response) => {
      this.removeSpinner();
      const body = res.json();
      return body.result || body || { };
    }
    protected handleError = (error: Response | any) => {
        this.removeSpinner();
        const errObj: any = {};
        let httpStatusCode: any;

        if (error instanceof Response) {
            let body;
            try {
                body = error.json();
            } catch (e) {
                body = {};
                body.error = 'Something went wrong. Please contact administrator.';
                body.message = body.error;
            }
            const err = body.error || JSON.stringify(body);
            httpStatusCode = `${error.status}`;
            errObj.Error = `${error.status} - ${error.statusText || ''} ${err}`;
            errObj.Message = body.ExceptionMessage == null ? body.message : body.ExceptionMessage;
        } else {
            errObj.Error = `${error.status} - ${error.statusText || ''} ${error.toString()}`;
            errObj.Message = error.message ? error.message : error.toString();
        }
            //this._applicationService.showErrorNotification('Error', errObj.Message);
    }

    private addSpinner = () => {
        this.spinnerCounter++;
        //setTimeout(() => this._applicationService.showSpinner = true);
    }

    private removeSpinner = () => {
        this.spinnerCounter--;
        if (this.spinnerCounter <= 0) {
            //setTimeout(() => this._applicationService.showSpinner = false);
        }
    }
  }
