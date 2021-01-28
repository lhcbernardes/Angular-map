import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService, AlertService } from '../_services'

@Component({templateUrl: 'perfil.component.html'})
export class PerfilComponent implements OnInit {
    perfilForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    user = [];
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public userService: UserService,
        private alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.perfilForm = this.formBuilder.group({
            email: ['', Validators.required],
            first: ['', Validators.required],
            last: ['', Validators.required],
            job: ['', Validators.required]
        });
        this.userService.getProfile()

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.perfilForm.controls; }

    onSubmit() {
        

        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();
        
        // stop here if form is invalid
        if (this.perfilForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.updateUser(this.f.email.value,this.f.first.value,this.f.last.value, this.f.job.value).pipe(first())
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });

    }
}