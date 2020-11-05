import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from 'src/app/core/services/leaderboards.service';
import { Router } from '@angular/router';

import { uniq } from 'lodash';
import { exportArrayCSV } from 'src/app/core/utils/export-array-csv.util';

@Component({
  selector: 'wm-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  hasAccess: boolean;

  leaderboards: any[];

  totalTimesGamePlayed: number;
  uniqueUsers: number;

  isDeleting: boolean;

  constructor(
    private leaderboardService: LeaderboardService,
    private router: Router
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.askForPassword();
    }, 2000);

    this.leaderboardService.allLeaderboards$.subscribe((leaderboards) => {
      this.totalTimesGamePlayed = leaderboards.length;
      this.uniqueUsers = uniq(leaderboards.map((l) => l.name)).length;

      this.leaderboards = leaderboards.sort((a, b) => b.time - a.time);
    });
  }

  exportCSV() {
    exportArrayCSV(this.leaderboards, 'leaderboards.csv');
  }

  reset() {
    const password = prompt('Please enter the password');

    if (password === 'beehive2020') {
      this.isDeleting = true;

      this.leaderboardService.deleteAll().subscribe(() => {
        this.isDeleting = false;
        alert('Deleted successfully!');
        this.router.navigate(['/']);
      });
    } else {
      if (confirm('wrong password!, enter the password again?')) {
        this.askForPassword();
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  private askForPassword() {
    const password = prompt('Please enter the password');

    if (password === 'beehive2020') {
      this.hasAccess = true;
    } else {
      if (confirm('wrong password!, enter the password again?')) {
        this.askForPassword();
      } else {
        this.router.navigate(['/']);
      }
    }
  }
}
