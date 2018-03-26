import {StationStatus} from './index';
import { Data } from './station-status-data.model';

export interface NYBSStatus {
  last_updated: number;
  ttl: number;
  data: Data;
}
