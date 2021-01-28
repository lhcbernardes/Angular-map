import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { UserModel } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) {
        this.getProfile();
     }
    id = null;
     user;


    getProfile() {
       this.http.get<UserModel>(`${environment.apiUrl}/users`)
        .subscribe(users => {
            const email = JSON.parse(localStorage.getItem('email'))
            let user = users.data.filter((res) => {
                return res.email == email;
              })
            this.id = user[0].id
            this.user = user[0]
        });
    }

    aboutUser(id){
        return this.http.get<any[]>(`${environment.apiUrl}/user/${id}`);
    }

    register(user) {
        return this.http.post(`${environment.apiUrl}/register`, user);
    }

    updateUser(email: string, first: string, last?: string, job?: string){
        let token = localStorage.getItem('currentUser');
        const headers = { 'Authorization': `${token}`};
        const body = {'email': `${email}`,'first': `${first}`,'last': `${last}`, 'job': `${job}`};
       return this.http.put<any>(`${environment.apiUrl}/users/${this.id}`, body, { headers });
    }
}