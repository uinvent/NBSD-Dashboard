import { EightdStationService } from './index';

export interface StationStatus {
  station_id: string;
  num_bikes_available: number;
  num_ebikes_available: number;
  num_bikes_disabled: number;
  num_docks_available: number;
  num_docks_disabled: number;
  is_installed: number;
  is_renting: number;
  is_returning: number;
  last_reported: number;
  eightd_has_available_keys: boolean;
  eightd_active_station_services: EightdStationService[];
}
