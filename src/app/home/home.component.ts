import { Data } from './../_models/user';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';
declare var google;
import { first } from 'rxjs/operators';
import { UserService, AuthenticationService } from '../_services';
import { UserModel } from '../_models/user';

@Component({ templateUrl: 'home.component.html',
styleUrls:  [ 'home.component.css' ] })
export class HomeComponent implements OnInit {
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
    private user = localStorage.getItem('email');
    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private mapsAPILoader: MapsAPILoader,
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
      // @ts-ignore
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          // @ts-ignore
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
    }

    private setCurrentPosition() {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.zoom = 12;
            this.places.push(position);
          });
        }
      }
}