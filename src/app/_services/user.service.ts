import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any[]>(`${environment.apiUrl}/users`);
    }

    aboutUser(id){
        return this.http.get<any[]>(`${environment.apiUrl}/user/${id}`);
    }

    register(user) {
        return this.http.post(`${environment.apiUrl}/register`, user);
    }

    delete(id) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }
}