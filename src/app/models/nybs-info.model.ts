import { StationInfo } from './index';
import { Data } from './station-info-data.model';

export interface NYBSInfo {
  last_updated: number;
  ttl: number;
  data: Data;
}
