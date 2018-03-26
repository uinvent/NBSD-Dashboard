import { Component, OnInit } from '@angular/core';
import {StationService} from '../app/services/index';
import {StationInfo, NYBSInfo, StationStatus, StationStatusHistory} from '../app/models/index';
import { Observable } from 'rxjs/Observable';
import { MouseEvent } from '@agm/core';
import 'linq4js';
import { isNumeric } from 'rxjs/util/isNumeric';
import { CompleterService, CompleterData } from 'ng2-completer';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public nybsInfo: NYBSInfo;
  public stationInfo: StationInfo[] = new Array<StationInfo>();
  public stationStatus: StationStatus[] = new Array<StationStatus>();
  public checked = false;
  public dataService: CompleterData;
  public selectedStation: StationInfo;
  public selectedStationName = '';
  public enteredDistance = '';

  public google: any;

  public zoom;
  public lat;
  public lng;

  public totalNumberOfBikesAvailable = 0;
  public totalCapacty = 0;

  public currentUsageChartType = 'doughnut';
  public currentUsageChartLabels: string[] = ['Capacity', 'Bikes Available'];
  public currentUsageChartData: number[] = [1, 0];

  public historyData: StationStatusHistory[] = [];

  public historicalUsageChartData: any[] = [[], []];
  public historicalUsageChartLabels: string[] = [];
  public historicalUsageChartType = 'bar';
  public historicalUsageChartLegend = true;

  public historicalUsageChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true
  };

  constructor(public stationService: StationService, public completerService: CompleterService) {
      this.setMapDefaultSettings();
      this.syncData();
  }

  public setMapDefaultSettings() {
    this.zoom = 16;
    this.lat =  40.760610;
    this.lng = -73.995242;
  }

  public isStationDataValid(): boolean {
    let isStationDataValid = false;
    if (this.selectedStation != null && this.enteredDistance != null) {
      if (isNumeric(this.enteredDistance)) {
        isStationDataValid = true;
      }
    }
    return isStationDataValid;
  }

  public stationSelected($event) {
    if ($event) {
      this.selectedStation = this.stationInfo.FirstOrDefault(x => x.station_id === $event.originalObject.station_id);

      this.lat = this.selectedStation.lat;
      this.lng = this.selectedStation.lon;
      this.zoom = 16;

      this.currentUsageChartData = [this.selectedStation.capacity, this.selectedStation.station_status.num_bikes_available];
      this.historicalUsageChartData = [
        {
        data: this.historyData.Where(x => x.station_id === this.selectedStation.station_id)
        .Select(x => x.capacity), label: 'Capacity'
        },
        {
          data: this.historyData.Where(x => x.station_id === this.selectedStation.station_id)
          .Select(x => x.num_bikes_available), label: 'Bikes Available'
        }
        ];
    } else {
      this.selectedStation = null;
    }
  }

  public SetViewMapForFilteredStation() {
    if (this.isStationDataValid()) {
      this.stationInfo.forEach(station => {

        if (this.isInRange(this.selectedStation, station)) {
          station.is_visible = true;
       } else {
        station.is_visible = false;
       }

      });
    } else {
      // throw warning toast
    }
  }

  public cloneObject = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  }

  public viewMapForAllStation() {
      this.setMapDefaultSettings();

      this.stationInfo.forEach(station => {
        station.is_visible = true;
      });

      this.currentUsageChartData = [this.totalCapacty, this.totalNumberOfBikesAvailable];
      this.historicalUsageChartData = [
        {
        data: this.historyData.Where(x => x.station_id === '0').Select(x => x.capacity), label: 'Capacity'
        },
        {
          data: this.historyData.Where(x => x.station_id === '0').Select(x => x.num_bikes_available), label: 'Bikes Available'
        }
        ];

      this.selectedStation = null;
      this.enteredDistance = '';
      this.selectedStationName = '';
  }

  ngOnInit() {
    Observable.forkJoin(
      this.stationService.getnybsInfo(),
      this.stationService.getAllSationsStatus()).subscribe(response => {
        this.stationInfo = response[0].data.stations;
        this.stationStatus = response[1].data.stations;
        this.synchronizeStationsData();
    });
  }

  synchronizeStationsData() {
    this.totalCapacty = 0;
    this.totalNumberOfBikesAvailable = 0;
    const time_accuired = new Date().getMinutes();
    this.stationInfo.forEach(station => {
      station.is_visible = true;
      station.station_status =  this.stationStatus.FirstOrDefault(x => x.station_id === station.station_id);
      station.img_uri = this.getImagePath(station.capacity, station.station_status.num_bikes_available);
      this.totalCapacty += station.capacity;
      this.totalNumberOfBikesAvailable += station.station_status.num_bikes_available;

      const histData: StationStatusHistory = new StationStatusHistory();
      histData.station_id = station.station_id;
      histData.capacity = station.capacity;
      histData.last_reported = station.station_status.last_reported;
      histData.num_bikes_available = station.station_status.num_bikes_available;
      histData.time_accuired = time_accuired;
       this.historyData.Add(histData);
    });

    const masterData: StationStatusHistory = new StationStatusHistory();
    masterData.station_id = '0';
    masterData.capacity = this.totalCapacty;
    masterData.num_bikes_available = this.totalNumberOfBikesAvailable;
    masterData.time_accuired = time_accuired;
    this.historyData.Add(masterData);

    this.historicalUsageChartLabels.Add(time_accuired.toString());
    this.historicalUsageChartData = [
      {
      data: this.historyData.Where(x => x.station_id === '0').Select(x => x.capacity), label: 'Capacity'
      },
      {
        data: this.historyData.Where(x => x.station_id === '0').Select(x => x.num_bikes_available), label: 'Bikes Available'
      }
      ];
    this.dataService = this.completerService.local(this.stationInfo, 'name', 'name');
    this.currentUsageChartData = [this.totalCapacty, this.totalNumberOfBikesAvailable];
    this.syncChartsForFilteredStation();
    this.SetViewMapForFilteredStation();
  }

  public syncChartsForFilteredStation() {
    if (this.selectedStation != null) {
      this.currentUsageChartData = [this.selectedStation.capacity, this.selectedStation.station_status.num_bikes_available];
      this.historicalUsageChartData = [
        {
        data: this.historyData.Where(x => x.station_id === this.selectedStation.station_id)
        .Select(x => x.capacity), label: 'Capacity'
        },
        {
          data: this.historyData.Where(x => x.station_id === this.selectedStation.station_id)
          .Select(x => x.num_bikes_available), label: 'Bikes Available'
        }
        ];
    }
  }

  getImagePath(capacity: number, num_bikes_available: number): string {
    const orangeImgUri = '../assets/orange-pin.png';
    const greenImgUri = '../assets/green-pin.png';
    const redImgUri = '../assets/red-pin.png';
    const percentageOfBikesAvailable = num_bikes_available / capacity;

    let imagePath = redImgUri;

    if (percentageOfBikesAvailable > 0.75) {
      imagePath = greenImgUri;
    } else if (percentageOfBikesAvailable > 0.5) {
      imagePath = orangeImgUri;
    }
  return imagePath;
  }

  isInRange(srcStation: StationInfo, destStation: StationInfo): boolean {
    let isInRange = false;
    // Recieved in Meters
    let distanceFromSrc = this.getDistance(srcStation.lat, srcStation.lon, destStation.lat, destStation.lon);
    // Convert it in KM
    distanceFromSrc = distanceFromSrc / 1000;
    if (distanceFromSrc <= Number(this.enteredDistance)) {
      isInRange = true;
    }
  return isInRange;
  }

  getDistance(srcLat, srcLon, destLat, destLon): number {
    const srcLatLng = new google.maps.LatLng(srcLat, srcLon);
    const desLatLng = new google.maps.LatLng(destLat, destLon);
    const distance = google.maps.geometry.spherical.computeDistanceBetween(srcLatLng, desLatLng);
  return distance;
  }
  public syncData() {
    Observable
    .interval(1 * 60 * 1000)
    .timeInterval()
    .subscribe(data => {
      this.ngOnInit();
    });
  }
}
