import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wm-enter-name',
  templateUrl: './enter-name.component.html',
  styleUrls: ['./enter-name.component.scss'],
})
export class EnterNameComponent implements OnInit {
  name: string;
  isError: boolean;

  constructor(private router: Router) {}

  ngOnInit() {}

  next() {
    if (this.name && this.name.trim().length > 0) {
      localStorage.setItem('name', this.name);
      this.router.navigate(['/how-to-play']);
    } else {
      this.isError = true;
      setTimeout(() => (this.isError = false), 1000);
    }
  }
}
