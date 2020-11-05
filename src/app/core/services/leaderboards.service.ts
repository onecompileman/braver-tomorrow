import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Leaderboard } from 'src/app/shared/models/leaderboard.model';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  collectionName = 'leaderboards';

  leaderboards$: BehaviorSubject<Leaderboard[]> = new BehaviorSubject([]);
  allLeaderboards$: BehaviorSubject<Leaderboard[]> = new BehaviorSubject([]);

  constructor(private angularFirestore: AngularFirestore) {
    this.getAllLeader().subscribe((leaderboards) => {
      this.leaderboards$.next(leaderboards);
      console.log(leaderboards);
    });

    this.getAll().subscribe((allLeaderboards) => {
      console.log(allLeaderboards);
      this.allLeaderboards$.next(allLeaderboards);
    });
  }

  create(leaderboard: Leaderboard): Promise<DocumentReference> {
    return this.angularFirestore
      .collection<Leaderboard>(this.collectionName)
      .add(leaderboard);
  }

  getById(id: string): Observable<Leaderboard> {
    return this.angularFirestore
      .collection<Leaderboard>(this.collectionName)
      .doc(id)
      .valueChanges()
      .pipe(map((leaderboard: any) => ({ ...leaderboard, id })));
  }

  getAllLeader(): Observable<Leaderboard[]> {
    return this.angularFirestore
      .collection<Leaderboard>(this.collectionName, (ref) =>
        ref.where('time', '>', 0).orderBy('time', 'desc').limit(5)
      )
      .valueChanges({ idField: 'id' });
  }

  getAll(): Observable<Leaderboard[]> {
    return this.angularFirestore
      .collection<Leaderboard>(this.collectionName)
      .valueChanges({ idField: 'id' });
  }

  delete(id: string): Observable<any> {
    return new Observable((observer) => {
      this.angularFirestore
        .collection<Leaderboard>(this.collectionName)
        .doc(id)
        .delete()
        .then((res) => {
          console.log(res);
          observer.next(null);
          observer.complete();
        });
    });
  }

  deleteAll(): Observable<any> {
    const deleteLeaderboards$ = this.allLeaderboards$.pipe(
      switchMap((leaderboards) =>
        zip(...leaderboards.map((leader) => this.delete(leader.id)))
      )
    );

    return deleteLeaderboards$;
  }
}
