import { Injectable } from '@angular/core';
import {
  CapacitorCalendar,
  CalendarPermissionScope,
} from '@ebarooni/capacitor-calendar';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  async addEvent(
    title: string,
    location: string,
    notes: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    success: boolean;
    reason?: 'permission' | 'plugin' | 'unknown';
    message?: string;
  }> {
    try {
      const ok = await this.ensureCalendarPermission();
      if (!ok) {
        return {
          success: false,
          reason: 'permission',
          message: 'Calendar permission required to save events',
        };
      }

      await CapacitorCalendar.createEvent({
        title,
        location,
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
      });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        reason: 'plugin',
        message: err?.message
          ? String(err.message)
          : 'Failed to create calendar event',
      };
    }
  }

  private async ensureCalendarPermission(): Promise<boolean> {
    try {
      const isNative =
        Capacitor.getPlatform && Capacitor.getPlatform() !== 'web';

      const status = await CapacitorCalendar.checkPermission?.({
        scope: CalendarPermissionScope.WRITE_CALENDAR,
      });
      if (this.permissionGranted(status)) return true;

      if (isNative) {
        const tryOrder = [
          'requestFullCalendarAccess',
          'requestWriteOnlyCalendarAccess',
          'requestReadOnlyCalendarAccess',
          'requestAllPermissions',
          'requestPermission',
        ];

        for (const method of tryOrder) {
          // @ts-ignore
          if (typeof CapacitorCalendar[method] === 'function') {
            try {
              // @ts-ignore
              const res = await CapacitorCalendar[method]({
                scope: CalendarPermissionScope.WRITE_CALENDAR,
              });
              if (this.permissionGranted(res)) return true;
            } catch {
              // try next method
            }
          }
        }
      }

      // @ts-ignore
      const requested = await CapacitorCalendar.requestPermission?.({
        scope: CalendarPermissionScope.WRITE_CALENDAR,
      });
      if (this.permissionGranted(requested)) return true;

      const isWeb =
        typeof window !== 'undefined' &&
        window.location?.protocol?.startsWith('http');
      return !!isWeb;
    } catch {
      const isWeb =
        typeof window !== 'undefined' &&
        window.location?.protocol?.startsWith('http');
      return !!isWeb;
    }
  }

  private permissionGranted(resp: any): boolean {
    if (!resp) return false;
    if (typeof resp === 'string') return resp.toLowerCase().includes('grant');
    if (typeof resp === 'object') {
      if ('granted' in resp) return !!resp.granted;
      if ('result' in resp)
        return String(resp.result).toLowerCase().includes('grant');
      if ('value' in resp) return !!resp.value;
    }
    return false;
  }
}
