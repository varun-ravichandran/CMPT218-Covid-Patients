import { HttpClient } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { Patient, PatientData } from './patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {


  constructor(private http: HttpClient) { 

  }
  guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8(false) + _p8(true) + _p8(true) + _p8(false);
  }

  getAllPatients():Observable<Patient[]>{
    return this.http.get<Patient[]>('https://218.selfip.net/apps/OdIG4mLzKG/collections/patientsList/documents/');
  }

  deletePatient(id:string):Observable<{}>{
    return this.http.delete(`https://218.selfip.net/apps/OdIG4mLzKG/collections/patientsList/documents/${id}/`);
  }

  addPatient(patientData:PatientData):Observable<Patient>{
    const patient: Patient= {
      key: this.guid(),
      data: patientData
    }
    return this.http.post<Patient>('https://218.selfip.net/apps/OdIG4mLzKG/collections/patientsList/documents/', patient);
  }
}
