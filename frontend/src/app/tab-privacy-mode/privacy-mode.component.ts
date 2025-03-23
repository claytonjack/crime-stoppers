import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonDatetime,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonIcon,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../components/header/header.component';
import { IconsService } from '../services/icons.service';

@Component({
  selector: 'app-privacy-mode',
  templateUrl: './privacy-mode.component.html',
  styleUrls: ['./privacy-mode.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonDatetime,
    HeaderComponent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonList,
    IonIcon,
  ],
})
export class PrivacyModeComponent implements OnInit {
  events = [
    {
      title: 'Team Meeting',
      date: '2023-11-20',
      time: '10:00 AM - 11:30 AM',
      attendees: 'Marketing Team',
      location: 'Conference Room A',
    },
    {
      title: 'Project Deadline',
      date: '2023-11-25',
      time: 'All Day',
      attendees: 'Development Team',
      location: 'Office',
    },
    {
      title: 'Client Presentation',
      date: '2023-11-28',
      time: '2:00 PM - 3:30 PM',
      attendees: 'Sales Team, Client',
      location: 'Meeting Room 3',
    },
  ];

  selectedDate: string = new Date().toISOString();

  constructor() {}

  ngOnInit() {}

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
  }

  getEventsForSelectedDate() {
    const formattedDate = this.selectedDate.split('T')[0];
    return this.events.filter((event) => event.date === formattedDate);
  }
}
