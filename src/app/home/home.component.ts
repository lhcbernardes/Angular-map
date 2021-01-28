import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: any;
    public users: [];
    id: number;
    private user = localStorage.getItem('email');
    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllUsers();
        this.aboutUser(this.user);
    }

    private aboutUser(user){
        this.userService.aboutUser(user)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    deleteUser(id: number) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    private loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe((users: any) => this.users = users.data);
    }
    
}