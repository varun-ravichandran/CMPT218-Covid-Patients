/// <reference types="@types/googlemaps" />

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatientService } from './patient.service';
import { Patient, PatientData } from './patient';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  

  patients: Patient[] = [];
  
  showLoader: boolean = true;
  @ViewChild('gmap') gmapElement;
  map: google.maps.Map;
  mapMarkers: google.maps.Marker[] = [];



  constructor(private ps: PatientService, private modalService: NgbModal){

  }

  ngOnInit(){
    this.getAllPatients();
  }

  ngAfterViewInit() {
    var mapProp = {
      center: new google.maps.LatLng(49.2, -123),
      zoom: 10,
      
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    
  }

  updateGoogleMap(){
    this.removeExistingMapMarkers();
    const covidLocations = {};
    this.patients.forEach(patient => {
      const {data: {locationType, location, position}} = patient;
      console.log(locationType, location);
      const latLon = `${position.lat}-${position.lng}`;
        // covidLocations[latLon]
      if(covidLocations[latLon]){   //grouping counting covidLocations[location]
        covidLocations[latLon].count+=1;    // count the repeataion of places
      }
      else{
        covidLocations[latLon] = {};
        covidLocations[latLon].count=1;
        covidLocations[latLon].coordinates=position; // markers in map
        covidLocations[latLon].city = location;
      }
    })
    const covidCities = Object.keys(covidLocations);  
    covidCities.forEach(city => { 
      const marker = new google.maps.Marker({
        position: covidLocations[city].coordinates,
        map: this.map,
        title: `<b>${covidLocations[city].city}</b> <br> ${covidLocations[city].count} cases reported`    
      });
      const infoWindow = new google.maps.InfoWindow({
        content: `<b>${covidLocations[city].city}</b> <br> ${covidLocations[city].count} cases reported` 
      });
      marker.addListener('mouseover', () => {
        infoWindow.open(this.map,marker);
      });
      marker.addListener('mouseout', () => {
        infoWindow.close();
      });
      console.log(marker,covidLocations[city]);
      this.mapMarkers.push(marker);
    })
  }

  removeExistingMapMarkers(){
    this.mapMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.mapMarkers = [];
  }

  getAllPatients(){
    this.ps.getAllPatients().subscribe(patients => {
      this.patients = patients;
      this.updateGoogleMap();
    })
  }

  deletePatient(id){
    this.ps.deletePatient(id).subscribe(()=>{
      this.patients = this.patients.filter(patient=>patient.key!=id);
      this.updateGoogleMap();
    })
  }
  

  addPatient(patientData:PatientData){
    this.ps.addPatient(patientData).subscribe(patient => {
      this.patients.push(patient);
      this.modalService.dismissAll();
      this.updateGoogleMap();
    })
  }
  open(content) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      
    })
  }
}