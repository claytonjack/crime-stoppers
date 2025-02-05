import { Component } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonButton, 
  IonMenuToggle, 
  IonIcon,
  IonText
} from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonButton, 
    IonMenuToggle, 
    IonIcon,
    IonText,
    CommonModule,
    HttpClientModule
  ]
})
export class Tab1Page {
  helloMessage: string = '';

  constructor(private http: HttpClient) {}

  fetchHelloWorld() {
		this.http.get('https://crime-stoppers-backend.onrender.com/api/hello', { responseType: 'text' }).subscribe({
			next: (response) => {
				this.helloMessage = response;
			},
			error: (err) => {
				this.helloMessage = 'Error fetching message';
				console.error('API Error:', err);
			}
		});
	}	
}
