import { StationStatus, EightdStationService } from './index';

export interface StationInfo {
  station_id: string;
  name: string;
  short_name: string;
  lat: number;
  lon: number;
  region_id: number;
  rental_methods: string[];
  capacity: number;
  rental_url: string;
  eightd_has_key_dispenser: boolean;
  eightd_station_services: EightdStationService[];
  station_status: StationStatus;
  img_uri: string;
  is_visible: boolean;
}
