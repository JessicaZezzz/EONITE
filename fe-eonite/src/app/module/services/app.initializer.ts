import { catchError, firstValueFrom, of } from 'rxjs';
import { RestApiServiceService } from "./rest-api-service.service";

export function appInitializer(authenticationService: RestApiServiceService) {
    return ()  => {
      return new Promise((resolve,reject) => {
        authenticationService.refreshToken(sessionStorage.getItem('ACCESS_TOKEN')).subscribe(response=>{
          if(response.statusCode==500){
            console.log(response)
          }else console.log('success')
        })
        return setTimeout(() => resolve(true), 50);
      })
    }
}
