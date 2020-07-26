import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/_models';
//import { Console } from 'console';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password) {
        return this.http.post<User>(`https://spotifydbvishali.azurewebsites.net/api/Admin/Admin`, { 'adminName': username, 'password': password })
            .pipe(map(user => {

                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;

            }));
    }

    logout() {

        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }


    getSongs() {
        return this.http.get("https://spotifydbvishali.azurewebsites.net/api/Admin/SongLists");
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id, SongName, SongUrl, Artists, Album, CoverImage): Observable<any> {
        console.log(id, SongName, SongUrl, Artists, Album, CoverImage);

        return this.http.put(`https://spotifydbvishali.azurewebsites.net/api/Admin/UpdateSong`, { 'id': id, 'name': SongName, 'url': SongUrl, 'artist': Artists, 'album': Album, 'image': CoverImage });           // .pipe(map(x => {

    }

    delete(id): Observable<any> {
        return this.http.delete(`https://spotifydbvishali.azurewebsites.net/api/Admin/DeleteSong?Id=${id}`)

    }


    AddSong(SongName, SongUrl, Artists, Album, CoverImage) {
        return this.http.post(`https://spotifydbvishali.azurewebsites.net/api/Admin/AddSong`, { 'name': SongName, 'url': SongUrl, 'artist': Artists, 'album': Album, 'image': CoverImage })

    }
}