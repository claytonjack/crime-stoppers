import { Injectable } from '@angular/core';
import {
  LocalNotifications,
  ScheduleOptions,
} from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class LocalNotificationsService {
  private readonly WEEKLY_ID = 101;
  private readonly MONTHLY_ID = 102;
  private readonly INACTIVITY_ID = 103;
  private readonly CHANNEL_ID = 'crime-stoppers-nottifications';

  constructor() {
    this.trackAppOpened();
  }
  async init(): Promise<void> {
    const permResult = await LocalNotifications.requestPermissions();
    console.log('Notification permission result:', permResult);

    if (permResult.display === 'granted') {
      await LocalNotifications.createChannel({
        id: this.CHANNEL_ID,
        name: 'Crime Stoppers Notifications',
        description: 'Notifications from Crime Stoppers',
        importance: 4, // High importance
      });
      console.log('Notification channel created');
    } else {
      console.warn('Notifications not granted by OS');
    }
  }

  async scheduleWeeklyReminder(): Promise<void> {
    if (!(await this.isNotificationEnabled())) return;

    await LocalNotifications.cancel({
      notifications: [{ id: this.WEEKLY_ID }],
    });

    const schedule: ScheduleOptions = {
      notifications: [
        {
          id: this.WEEKLY_ID,
          title: '📰 Stay in the loop',
          body: 'Explore the latest crime alerts and local events to stay informed and connected with your community',
          schedule: {
            repeats: true,
            on: { weekday: 1, hour: 10, minute: 0 }, // Monday 10:00 AM
          },
          channelId: this.CHANNEL_ID,
          smallIcon: 'ic_stat_notify',
        },
      ],
    };
    await LocalNotifications.schedule(schedule);
  }

  async triggerWeeklyTest(): Promise<void> {
    await this.triggerNow(
      this.WEEKLY_ID,
      '📰 Stay in the loop',
      'Explore the latest crime alerts and local events to stay informed and connected with your community'
    );
  }

  async scheduleMonthlyReminder(): Promise<void> {
    if (!(await this.isNotificationEnabled())) return;

    await LocalNotifications.cancel({
      notifications: [{ id: this.MONTHLY_ID }],
    });

    const schedule: ScheduleOptions = {
      notifications: [
        {
          id: this.MONTHLY_ID,
          title: '🔑 Got a lead?',
          body: 'Submitting an anonymous tip is easy and could be the key to solving a crime',
          schedule: {
            repeats: true,
            on: { day: 15, hour: 10, minute: 0 }, // 15th each month
          },
          channelId: this.CHANNEL_ID,
          smallIcon: 'ic_stat_notify',
        },
      ],
    };
    await LocalNotifications.schedule(schedule);
  }

  async triggerMonthlyTest(): Promise<void> {
    await this.triggerNow(
      this.MONTHLY_ID,
      '🔑 Got a lead?',
      'Submitting an anonymous tip is easy and could be the key to solving a crime'
    );
  }

  async checkInactivity(): Promise<void> {
    if (!(await this.isNotificationEnabled())) return;

    const { value } = await Preferences.get({ key: 'lastOpened' });
    if (!value) return;

    const lastOpened = new Date(value);
    const now = new Date();
    const diffDays =
      (now.getTime() - lastOpened.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays >= 90) {
      await this.triggerNow(
        this.INACTIVITY_ID,
        '👋 Checking In',
        'Access crucial safety information and community resources needed for a crime free Halton'
      );
    }
  }

  async triggerInactivityTest(): Promise<void> {
    await this.triggerNow(
      this.INACTIVITY_ID,
      '👋 Checking In',
      'Access crucial safety information and community resources needed for a crime free Halton'
    );
  }

  private async triggerNow(id: number, title: string, body: string) {
    if (!(await this.isNotificationEnabled())) return;

    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== 'granted') {
      console.warn('Notifications not permitted by OS');
      return;
    }

    console.log(`Scheduling notification [${id}]: ${title}`);
    await LocalNotifications.schedule({
      notifications: [
        {
          id,
          title,
          body,
          schedule: { at: new Date(Date.now() + 1000) }, // 1s delay
          channelId: this.CHANNEL_ID,
          smallIcon: 'ic_stat_notify',
        },
      ],
    });
  }

  private async isNotificationEnabled(): Promise<boolean> {
    try {
      const { value } = await Preferences.get({ key: 'notificationEnabled' });
      return value === null ? true : value === 'true';
    } catch {
      return true;
    }
  }

  async requestPermissions(): Promise<void> {
    await LocalNotifications.requestPermissions();
  }

  async trackAppOpened(): Promise<void> {
    await Preferences.set({
      key: 'lastOpened',
      value: new Date().toISOString(),
    });
  }
}
