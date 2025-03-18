import { Observable } from 'rxjs';

export interface IService<T> {
  get(): Observable<T[]>;
  add(model: T): Observable<void>;
  update(model: T): Observable<void>;
  delete(id: number): Observable<void>;
}
