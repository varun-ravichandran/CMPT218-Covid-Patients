/// <reference types="@types/googlemaps" />

import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PatientService } from '../patient.service';


@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {

  @Output() addPatientEvent = new EventEmitter();
  @Output() closeModalEvent = new EventEmitter();

  isTrue: boolean = false;

  form: FormGroup;
  defaultLocations = [
    { label: 'Metrotown', value: 'metrotown', position: { lat: 49.2273037, lng: -122.999984 } },
    { label: 'SFU Surrey', value: 'sfu-surrey', position: { lat: 49.186725, lng: -122.8490477 } },
    { label: 'Burnaby', value: 'burnaby', position: { lat: 49.2488091, lng: -122.9805104 } }

  ]
  patientGeoCodedLocation;
  geoCoder: google.maps.Geocoder;

  constructor(private ps: PatientService, private http: HttpClient) { }

  characters = "^[a-zA-Z ]*$";
  num = "^[1-9][0-9]*$";

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.pattern(this.characters)
        ]
      )),
      age: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.pattern(this.num)
        ]
      )),
      phoneNumber: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(this.num)
        ]
      )),
      emailId: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.email
        ]
      )),
      location: new FormControl(''),
      locationType: new FormControl('existing'),
      existingLocation: new FormControl('metrotown'),
      searchLocation: new FormControl('')
    })
  }


  ngAfterViewInit() {
    this.geoCoder = new google.maps.Geocoder();
  }

  get locationType() {
    return this.form.get('locationType').value;
  }

  findGeoCodeAddress() {            //Gets the latitude and longitude of the location entered
    const address = this.form.get('searchLocation').value;
    this.geoCoder.geocode({ address: address }, (result, status) => {
      if (status == 'OK') {
        // const formatted_address = result[0].formatted_address;
        alert("location searched, you can save now");
        this.form.controls['searchLocation'].setValue(address); //remove grouping
        console.log(result);
        this.patientGeoCodedLocation = { label: address, position: result[0].geometry.location.toJSON() }; 
      }
      else {
        alert('not found ' + status);
        this.form.controls['searchLocation'].setValue('');
      }
    });
  }

  onSubmit(newPatient) {
    let patientLocation;
    const { name, location, locationType, age, phoneNumber, emailId, existingLocation, searchLocation } = newPatient;
    if (locationType == 'existing') {
      patientLocation = this.defaultLocations.find(dLocation => dLocation.value == existingLocation);
    }
    else {
      if (!this.isTrue) {
        alert("Search the location before saving");
      }
      patientLocation = this.patientGeoCodedLocation;

    }
    console.log(patientLocation, this.defaultLocations, location);
    const patient = {
      name,
      location: patientLocation.label,
      locationType,
      age: Number(age),
      phoneNumber,
      emailId,
      createdDate: (new Date()).getTime(),
      position: patientLocation.position
    }
    console.log(patient);
    this.addPatientEvent.emit(patient);
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}
