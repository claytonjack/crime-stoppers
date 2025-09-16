import { Component, OnInit, inject } from '@angular/core';
import { BaseImport } from '../../../../core/base-import';
import {
  CrimeDataService,
  CrimeStats,
  CrimeRecord,
} from '../../../../core/services/crime-data.service';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonButton,
  IonIcon,
  IonChip,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartType,
  registerables,
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-crime-stats',
  standalone: true,
  templateUrl: './crime-stats.page.html',
  styleUrls: ['./crime-stats.page.scss'],
  imports: [
    ...BaseImport,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonButton,
    IonIcon,
    IonChip,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    BaseChartDirective,
  ],
})
export class CrimeStatsPage implements OnInit {
  crimeData: CrimeRecord[] = [];
  processedStats: CrimeStats[] = [];
  isLoading = true;
  error: string | null = null;

  selectedCity = 'ALL';
  selectedYear = new Date().getFullYear();

  availableCities: string[] = [];
  availableYears: number[] = [];

  totalCrimesLast12Months = 0;
  totalCrimesYearToDate = 0;
  topCrimeType = '';
  cityStats: { [city: string]: number } = {};
  dataStartDate = '';
  dataEndDate = '';
  last12MonthsPeriod = '';

  monthlyChartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };

  crimeTypeChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  monthlyChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Crime Trends (Rolling 12 Months)',
        color: '#333333',
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333333',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
          color: '#333333',
        },
        ticks: {
          color: '#333333',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Incidents',
          color: '#333333',
        },
        ticks: {
          color: '#333333',
        },
        beginAtZero: true,
      },
    },
  };

  crimeTypeChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Crime Types Comparison',
        color: '#333333',
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333333',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Crime Type',
          color: '#333333',
        },
        ticks: {
          color: '#333333',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Incidents',
          color: '#333333',
        },
        ticks: {
          color: '#333333',
        },
        beginAtZero: true,
      },
    },
  };

  private readonly crimeDataService = inject(CrimeDataService);

  ngOnInit() {
    this.loadCrimeData();
  }

  private loadCrimeData() {
    this.isLoading = true;
    this.error = null;

    this.crimeDataService.getCrimeData().subscribe({
      next: (data) => {
        console.log('Raw data received:', data.length, 'records');

        const filteredData = data.filter((record) => {
          const description = record.DESCRIPTION?.toLowerCase() || '';
          const isRoadsideTest =
            description.includes('roadside test') ||
            description.includes('roadside testing') ||
            description.includes('road side test') ||
            description.includes('roadside screen') ||
            description.includes('roadside screening');

          if (isRoadsideTest) {
            console.log('Filtered out roadside test:', record.DESCRIPTION);
          }

          return !isRoadsideTest;
        });

        console.log('Filtered data:', filteredData.length, 'records');
        console.log(
          'Excluded',
          data.length - filteredData.length,
          'roadside test records'
        );

        this.crimeData = filteredData;
        this.processedStats =
          this.crimeDataService.processCrimeDataToMonthlyStats(filteredData);
        this.initializeFilters();
        this.updateCharts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading crime data:', err);
        this.error = 'Failed to load crime data. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  private initializeFilters() {
    this.availableCities = this.crimeDataService.getUniqueCities(
      this.crimeData
    );

    const years = new Set(this.processedStats.map((stat) => stat.year));
    this.availableYears = Array.from(years).sort((a, b) => b - a);

    this.calculateQuickStats();
  }

  public onFilterChange() {
    console.log('Filter changed:', {
      selectedYear: this.selectedYear,
      selectedCity: this.selectedCity,
    });
    this.updateCharts();
    this.calculateQuickStats();
  }

  private updateCharts() {
    console.log('Updating charts with data:', {
      processedStats: this.processedStats.length,
      selectedYear: this.selectedYear,
      selectedCity: this.selectedCity,
    });
    this.updateMonthlyChart();
    this.updateCrimeTypeChart();
  }

  private updateMonthlyChart() {
    if (!this.processedStats || this.processedStats.length === 0) {
      this.monthlyChartData = {
        labels: [],
        datasets: [],
      };
      return;
    }

    let filteredStats = this.processedStats;

    if (this.selectedCity !== 'ALL') {
      const selectedCityUpper = this.selectedCity.toUpperCase();
      filteredStats = this.processedStats.filter(
        (stat) => stat.city.toUpperCase() === selectedCityUpper
      );
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const rollingMonths: string[] = [];
    const monthlyDataRolling: { [key: string]: number } = {};
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(currentMonth - i);

      const monthName = monthNames[date.getMonth()];
      const monthKey = monthName;

      rollingMonths.push(monthName);
      monthlyDataRolling[monthName] = 0;
    }

    filteredStats.forEach((stat) => {
      if (stat.month && stat.year) {
        const statDate = new Date(stat.year, monthNames.indexOf(stat.month));

        for (let i = 0; i < rollingMonths.length; i++) {
          const rollingDate = new Date(now);
          rollingDate.setMonth(currentMonth - (11 - i));

          if (
            statDate.getMonth() === rollingDate.getMonth() &&
            statDate.getFullYear() === rollingDate.getFullYear()
          ) {
            monthlyDataRolling[rollingMonths[i]] += stat.count;
            break;
          }
        }
      }
    });

    this.monthlyChartData = {
      labels: rollingMonths,
      datasets: [
        {
          label: `Last 12 Months - ${
            this.selectedCity === 'ALL'
              ? 'All Cities'
              : this.formatCityName(this.selectedCity)
          } - All Crime Types`,
          data: rollingMonths.map((month) => monthlyDataRolling[month]),
          borderColor: '#3880ff',
          backgroundColor: 'rgba(56, 128, 255, 0.1)',
          tension: 0.1,
          fill: false,
        },
      ],
    };

    console.log('Monthly chart data:', this.monthlyChartData);
  }

  private updateCrimeTypeChart() {
    if (!this.processedStats || this.processedStats.length === 0) {
      this.crimeTypeChartData = {
        labels: [],
        datasets: [],
      };
      return;
    }

    let filteredStats = this.processedStats;

    if (this.selectedCity !== 'ALL') {
      const selectedCityUpper = this.selectedCity.toUpperCase();
      filteredStats = this.processedStats.filter(
        (stat) => stat.city.toUpperCase() === selectedCityUpper
      );
    }

    const crimeTypeData: { [key: string]: number } = {};

    filteredStats.forEach((stat) => {
      if (stat.crimeType) {
        if (!crimeTypeData[stat.crimeType]) {
          crimeTypeData[stat.crimeType] = 0;
        }
        crimeTypeData[stat.crimeType] += stat.count;
      }
    });

    const sortedCrimeTypes = Object.keys(crimeTypeData).sort(
      (a, b) => crimeTypeData[b] - crimeTypeData[a]
    );

    this.crimeTypeChartData = {
      labels: sortedCrimeTypes,
      datasets: [
        {
          label: 'Number of Incidents',
          data: sortedCrimeTypes.map((type) => crimeTypeData[type]),
          backgroundColor: [
            '#3880ff',
            '#10dc60',
            '#ffce00',
            '#f04141',
            '#7044ff',
            '#ff6600',
            '#0cd1e8',
            '#ffc409',
          ],
          borderColor: [
            '#3880ff',
            '#10dc60',
            '#ffce00',
            '#f04141',
            '#7044ff',
            '#ff6600',
            '#0cd1e8',
            '#ffc409',
          ],
          borderWidth: 1,
        },
      ],
    };

    console.log('Crime type chart data:', this.crimeTypeChartData);
  }

  private calculateQuickStats() {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    this.dataStartDate = oneYearAgo.toLocaleDateString();
    this.dataEndDate = now.toLocaleDateString();
    this.last12MonthsPeriod = `${oneYearAgo.toLocaleDateString()} - ${now.toLocaleDateString()}`;

    let relevantStats = this.processedStats;

    if (this.selectedCity !== 'ALL') {
      const selectedCityUpper = this.selectedCity.toUpperCase();
      relevantStats = this.processedStats.filter(
        (stat) => stat.city.toUpperCase() === selectedCityUpper
      );
    }

    this.totalCrimesLast12Months = relevantStats.reduce(
      (total, stat) => total + stat.count,
      0
    );

    this.totalCrimesYearToDate = this.totalCrimesLast12Months;
    const crimeTypeCounts: { [key: string]: number } = {};
    relevantStats.forEach((stat) => {
      crimeTypeCounts[stat.crimeType] =
        (crimeTypeCounts[stat.crimeType] || 0) + stat.count;
    });

    this.topCrimeType = Object.keys(crimeTypeCounts).reduce(
      (a, b) => (crimeTypeCounts[a] > crimeTypeCounts[b] ? a : b),
      'None'
    );

    this.cityStats = {};
    this.processedStats.forEach((stat) => {
      this.cityStats[stat.city] = (this.cityStats[stat.city] || 0) + stat.count;
    });
  }

  public selectCity(city: string) {
    this.selectedCity = city;
    this.onFilterChange();
  }

  public getCityButtonClass(city: string): string {
    return this.selectedCity === city ? 'city-button-active' : 'city-button';
  }

  public formatCityName(cityName: string): string {
    if (!cityName) return '';
    return cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
  }

  public refreshData() {
    this.loadCrimeData();
  }
}
