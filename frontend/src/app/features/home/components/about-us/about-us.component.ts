import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonItem, IonLabel, IonList],
})
export class AboutUsComponent {
  aboutItems = [
    {
      title: 'Our Story',
      details:
        'Crime Stoppers of Halton is a non-profit organization with 35+ years of service, working as part of a global network of 1,800 crime prevention programs.',
      icon: 'globe',
    },
    {
      title: 'What We Do',
      details:
        'We enable anonymous crime reporting with rewards up to $2,000 for successful tips, connecting citizens with police while guaranteeing complete anonymity.',
      icon: 'call',
    },
    {
      title: 'Community Impact',
      details:
        'Together, we create a safer Halton Region through community-powered crime prevention that protects tipsters while helping solve crimes.',
      icon: 'happy',
    },
  ];

  constructor() {}
}
