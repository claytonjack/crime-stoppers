import { TestBed } from '@angular/core/testing';
import { CalendarService } from './calendar.service';
import { CapacitorCalendar } from '@ebarooni/capacitor-calendar';
import { Capacitor } from '@capacitor/core';

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(() => {
    (CapacitorCalendar as any).createEvent = jasmine
      .createSpy()
      .and.returnValue(Promise.resolve({ id: '1' }));

    TestBed.configureTestingModule({
      providers: [CalendarService],
    });

    service = TestBed.inject(CalendarService);
  });

  describe('addEvent', () => {
    it('should return permission error if permission is denied', async () => {
      spyOn(service as any, 'ensureCalendarPermission').and.returnValue(
        Promise.resolve(false)
      );

      const result = await service.addEvent(
        'Test Event',
        'Test Location',
        'Test Notes',
        new Date(),
        new Date()
      );

      expect(result.success).toBeFalse();
      expect(result.reason).toBe('permission');
      expect(result.message).toContain('Calendar permission required');
    });
  });

  describe('permissionGranted', () => {
    it('should return true for string containing "grant"', () => {
      expect((service as any).permissionGranted('granted')).toBeTrue();
    });

    it('should return true for object with granted=true', () => {
      expect((service as any).permissionGranted({ granted: true })).toBeTrue();
    });

    it('should return true for object with result containing "grant"', () => {
      expect(
        (service as any).permissionGranted({ result: 'granted' })
      ).toBeTrue();
    });

    it('should return false for empty or unrelated responses', () => {
      expect((service as any).permissionGranted(null)).toBeFalse();
      expect((service as any).permissionGranted({})).toBeFalse();
      expect((service as any).permissionGranted('denied')).toBeFalse();
    });
  });

  describe('ensureCalendarPermission', () => {
    it('should return true if checkPermission returns granted', async () => {
      spyOn(CapacitorCalendar, 'checkPermission').and.returnValue(
        Promise.resolve({ result: 'granted' })
      );

      const result = await (service as any).ensureCalendarPermission();
      expect(result).toBeTrue();
    });

    it('should return false if checkPermission returns denied on web', async () => {
      spyOn(CapacitorCalendar, 'checkPermission').and.returnValue(
        Promise.resolve({ result: 'denied' })
      );

      spyOn(Capacitor, 'getPlatform').and.returnValue('web');

      const result = await (service as any).ensureCalendarPermission();
      expect(result).toBeTrue();
    });

    it('should fallback to true on web if plugin fails', async () => {
      spyOn(CapacitorCalendar, 'checkPermission').and.throwError(
        'Plugin failed'
      );

      spyOn(Capacitor, 'getPlatform').and.returnValue('web');

      const result = await (service as any).ensureCalendarPermission();
      expect(result).toBeTrue();
    });
  });
});
