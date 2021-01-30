import { PlaceModel } from './../_models/place';
import { Component, ElementRef, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
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

  // Map
    currentUser: any;
    users : UserModel = new UserModel();
    //places: PlaceModel = new PlaceModel();
    places:any = [];
    id: number;
    autocomplete:any;
    list = {}
  // Form
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

  // Rating
    max = 10;
    rate = 7;
    isReadonly = false;
    overStar: number | undefined;
    percent: number;

  // Modal
  title: string = ' ';
  comments = [];
  local: number;
    constructor(
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private mapsAPILoader: MapsAPILoader,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private ngZone: NgZone
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }
    

    ngOnInit() {
      this.form = this.formBuilder.group({
        rating: ['', Validators.required],
        comment: ['', Validators.required]
    });

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

          // reset alerts on submit
          this.alertService.clear();

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
    }

    onSubmit(){
      this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();
        
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        //this.places.concat(this.f.rating.value,this.f.comment.value)
        console.log(this.places)
        this.form.reset();
        this.submitted = false;
    }

    openModal(template: TemplateRef<any>, place) {
      this.title = place;
      this.local = this.places.indexOf(place)

      // AQUI
      //this.comments = this.places[this.local];
      this.modalRef = this.modalService.show(template);
      console.log(this.places)
      }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    
    savePoints(){
       // reset alerts on submit
       this.alertService.clear();

       // compare if existe and add 
      if (this.places.indexOf(this.autocomplete.gm_accessors_.place.se.formattedPrediction) > -1) {
        this.alertService.error("This place already exists");
      } else {
        this.places.push(this.autocomplete.gm_accessors_.place.se.formattedPrediction)
      }
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

   

    hoveringOver(value: number): void {
      this.overStar = value;
      this.percent = (value / this.max) * 100;
    }
   
    resetStar(): void {
      this.overStar = void 0;
    }
}
