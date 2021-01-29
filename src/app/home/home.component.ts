import { Component, ElementRef, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';
declare var google;
import { AuthenticationService, AlertService } from '../_services';
import { UserModel } from '../_models/user';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({ templateUrl: 'home.component.html',
styleUrls:  [ 'home.component.css' ] })
export class HomeComponent implements OnInit {
  modalRef: BsModalRef;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;

    currentUser: any;
    users : UserModel = new UserModel()
    places: any = [];
    id: number;
    autocomplete:any;
    private user = localStorage.getItem('email');
    constructor(
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private mapsAPILoader: MapsAPILoader,
        private modalService: BsModalService,
        private ngZone: NgZone
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      this.autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place = this.autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          console.log(place.geometry.location)
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
    }

    savePoints(){

      if (this.places.indexOf(document.getElementById(this.autocomplete.gm_accessors_.place.se.formattedPrediction)) > -1) {
        this.alertService.error("This place already exists");
      } else {
        this.places.push(this.autocomplete.gm_accessors_.place.se.formattedPrediction)
  }
  console.log(this.autocomplete.gm_accessors_.place.se.formattedPrediction)
      console.log(this.places, "--array")
    }

    private setCurrentPosition() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 12;
        });
      }
    }

    openModal(template: TemplateRef<any>) {
      console.log(template)
      this.modalRef = this.modalService.show(template);
    }
}
