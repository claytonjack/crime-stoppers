import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface CrimeRecord {
  OBJECTID: number;
  CASE_NO: string;
  DATE: number;
  DESCRIPTION: string;
  LOCATION: string;
  CITY: string;
  Latitude: string;
  Longitude: string;
  GlobalID: string;
}

export interface ArcGISResponse {
  objectIdFieldName: string;
  uniqueIdField: any;
  globalIdFieldName: string;
  geometryType: string;
  spatialReference: any;
  fields: any[];
  exceededTransferLimit: boolean;
  features: {
    attributes: CrimeRecord;
    geometry: any;
  }[];
}

export interface CrimeStats {
  month: string;
  year: number;
  city: string;
  crimeType: string;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class CrimeDataService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl =
    'https://services2.arcgis.com/o1LYr96CpFkfsDJS/arcgis/rest/services/Crime_Map/FeatureServer/0/query';

  getCrimeData(): Observable<CrimeRecord[]> {
    const params = new HttpParams()
      .set('f', 'json')
      .set('where', '1=1')
      .set('outFields', '*')
      .set('resultRecordCount', '50000');

    return this.http
      .get<ArcGISResponse>(this.baseUrl, { params })
      .pipe(
        map((response) =>
          response.features.map((feature) => feature.attributes)
        )
      );
  }

  getCrimeDataByDateRange(
    startDate: Date,
    endDate: Date
  ): Observable<CrimeRecord[]> {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const whereClause = `DATE >= ${startTimestamp} AND DATE <= ${endTimestamp}`;

    const params = new HttpParams()
      .set('f', 'json')
      .set('where', whereClause)
      .set('outFields', '*')
      .set('resultRecordCount', '10000');

    return this.http
      .get<ArcGISResponse>(this.baseUrl, { params })
      .pipe(
        map((response) =>
          response.features.map((feature) => feature.attributes)
        )
      );
  }

  processCrimeDataToMonthlyStats(crimeData: CrimeRecord[]): CrimeStats[] {
    const stats: { [key: string]: CrimeStats } = {};

    crimeData.forEach((record) => {
      if (!record.DATE || !record.CITY || !record.DESCRIPTION) return;

      const date = new Date(record.DATE);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const city = record.CITY.trim().toUpperCase();
      const crimeType = this.categorizeCrimeType(record.DESCRIPTION.trim());

      const key = `${year}-${month}-${city}-${crimeType}`;

      if (stats[key]) {
        stats[key].count++;
      } else {
        stats[key] = {
          month,
          year,
          city,
          crimeType,
          count: 1,
        };
      }
    });

    return Object.values(stats).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;

      const monthOrder = [
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
      const monthDiff =
        monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      if (monthDiff !== 0) return monthDiff;

      if (a.city !== b.city) return a.city.localeCompare(b.city);

      return a.crimeType.localeCompare(b.crimeType);
    });
  }

  private categorizeCrimeType(description: string): string {
    const desc = description.toUpperCase();

    if (desc.includes('THEFT') || desc.includes('ROBBERY')) {
      return 'Theft & Robbery';
    } else if (desc.includes('BREAK') || desc.includes('BURGLARY')) {
      return 'Break & Enter';
    } else if (
      desc.includes('IMPAIRED') ||
      desc.includes('ROADSIDE') ||
      desc.includes('DUI')
    ) {
      return 'Impaired Driving';
    } else if (desc.includes('ASSAULT') || desc.includes('DOMESTIC')) {
      return 'Assault';
    } else if (desc.includes('FRAUD') || desc.includes('SCAM')) {
      return 'Fraud';
    } else if (desc.includes('DRUG') || desc.includes('NARCOTIC')) {
      return 'Drug Offenses';
    } else if (desc.includes('VEHICLE') || desc.includes('AUTO')) {
      return 'Vehicle Related';
    } else if (
      desc.includes('MVC') ||
      desc.includes('MOTOR VEHICLE COLLISION')
    ) {
      return 'Traffic Incidents';
    } else {
      return 'Other';
    }
  }

  getUniqueCities(crimeData: CrimeRecord[]): string[] {
    const cities = new Set(
      crimeData
        .map((record) => record.CITY?.trim().toUpperCase())
        .filter((city) => city)
    );
    return Array.from(cities).sort();
  }

  getUniqueCrimeTypes(stats: CrimeStats[]): string[] {
    const types = new Set(stats.map((stat) => stat.crimeType));
    return Array.from(types).sort();
  }
}
