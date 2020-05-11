import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  protected getItem<T>(key:string):T{
    const data = localStorage.getItem(key);
    if(data && data !== 'undefined'){
      return JSON.parse(data);
    }
    return null;
  }
  protected setItem(key:string, data: string | object){
    if(typeof data === 'string'){
      localStorage.setItem(key,data);
    }
    localStorage.setItem(key, JSON.stringify(data));
  }
  protected removeItem(item:string){
    localStorage.removeItem(item);
  }
  protected clear(){
    localStorage.clear();
  }
}
