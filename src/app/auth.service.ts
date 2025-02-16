import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { User } from './models/user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  id: number,
  username: string,
  accessToken: string,
  expiresIn: string,
  roles: any[]
}

export interface RefreshResponseData {
  accessToken: string,
  expiresIn: string,
  roles: any[]
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = new BehaviorSubject<User>(null as any);

  get userIsAuthenticated() {
    return this._user.asObservable()
      .pipe(
        map(user => {
          if (user) {
            return !!user.token
          } else {
            return false;
          }
        }));
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.id;
      } else {
        return null;
      }
    }))
  }

  get token() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.token
      } else {
        return null
      }
    }))
  }

  get roles() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.roles
      } else {
        return null
      }
    }))
  }
  constructor(private http: HttpClient,private router: Router) { }


  autoLogin(force = false) {
    return from(Preferences.get({
      key: 'authData'
    })).pipe(map(storedData => {
      if (!storedData || storedData.value == null) {
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as {
        id: number, 
        token: string,
        tokenExpirationDate: string,
        username: string,
        roles: any[]
      };

      const expirationTime = new Date(parsedData.tokenExpirationDate);
      if (expirationTime <= new Date() || force == true) {
        this.getRefreshToken().subscribe({
          next: (resData) => {
            const user = {
              id: parsedData.id,
              username: parsedData.username,
              accessToken: resData['accessToken'],
              expiresIn: resData['expiresIn'],
              roles: resData['roles']
            }
            this.setUserData(user)
          },
          error: (resErr) => {
            if (resErr.status == 401) {
              this.logOut()
            }else {
              console.error(resErr)
            }

          }
        }

        )

      }
      const user = new User(
        parsedData.id,
        parsedData.username,
        parsedData.token,
        expirationTime,
        parsedData.roles
      );
      return user;
    }), tap(user => {
      if (user) {
        this._user.next(user);
      }
    }), map(user => {
      return !!user;
    }))
  }

  login(username: string, password: string) {
    return this.http.post<AuthResponseData>(`${environment.api}/user/login`,
      {
        username: username,
        password: password
      }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logOut() {
    this._user.next(null as any);
    Preferences.remove({ key: 'authData' })
    this.router.navigateByUrl('/login')
  }

  private getRefreshToken() {
    return this.http.get<RefreshResponseData>(`${environment.api}/user/refresh`);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn
    );
    this._user.next(
      new User(
        userData.id,
        userData.username,
        userData.accessToken,
        expirationTime,
        userData.roles
      )
    );

    this.storeAuthData(
      userData.id,
      userData.accessToken,
      expirationTime.toISOString(),
      userData.username,
      userData.roles
    )
  }

  private storeAuthData(
    id: number,
    token: string,
    tokenExpirationDate: string,
    username: string,
    roles: any[]) {
    const data = JSON.stringify({
      id: id,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      username: username,
      roles: roles
    });
    Preferences.set({
      key: 'authData',
      value: data
    });
  }
}
