import { useEffect, useCallback, useState } from 'react';
import type { Reminder } from '../utils/types';
import { isReminderDue } from '../utils/reminderHelpers';

export function useNotification(reminders: Reminder[], onMarkNotified: (id: string) => void) {
  const [permission, setPermission] = useState<'granted' | 'denied' | 'default'>('default');
  const [notificationError, setNotificationError] = useState<string | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    } else {
      setNotificationError('当前浏览器不支持通知功能');
    }
    
    if (window.location.protocol !== 'https:') {
      setNotificationError('通知功能需要 HTTPS 环境');
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (window.location.protocol !== 'https:') {
      alert('通知功能需要在 HTTPS 环境下使用。请部署到支持 HTTPS 的平台（如 Vercel），或在手机上将应用添加到主屏幕后使用。');
      return 'denied';
    }
    
    if (!('Notification' in window)) {
      alert('当前浏览器不支持通知功能，请使用较新版本的 Chrome 或 Safari。');
      return 'denied';
    }
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      setNotificationError(null);
      
      if (result === 'granted') {
        new Notification('通知已开启', {
          body: '你将在提醒时间收到通知',
          icon: '/icon-192.png',
        });
      } else if (result === 'denied') {
        setNotificationError('通知权限已被拒绝，请在浏览器设置中手动开启');
      }
      
      return result;
    } catch (error) {
      console.error('请求通知权限失败:', error);
      setNotificationError('请求通知权限失败，请重试');
      return 'denied';
    }
  }, []);

  const showNotification = useCallback((reminder: Reminder) => {
    if (permission !== 'granted') {
      console.log('通知权限未授予');
      return;
    }
    
    try {
      new Notification(reminder.title, {
        body: reminder.note || '提醒时间到了',
        icon: '/icon-192.png',
        tag: reminder.id,
        requireInteraction: true,
      });
      console.log('通知已发送:', reminder.title);
    } catch (error) {
      console.error('发送通知失败:', error);
    }
  }, [permission]);

  useEffect(() => {
    const checkReminders = () => {
      const dueReminders = reminders.filter(isReminderDue);
      dueReminders.forEach(reminder => {
        showNotification(reminder);
        onMarkNotified(reminder.id);
      });
    };

    const interval = setInterval(checkReminders, 10000);
    checkReminders();

    return () => clearInterval(interval);
  }, [reminders, showNotification, onMarkNotified]);

  useEffect(() => {
    const handleNotificationClick = (event: Event) => {
      event.preventDefault();
      window.focus();
    };

    if ('Notification' in window) {
      window.addEventListener('notificationclick', handleNotificationClick);
      return () => window.removeEventListener('notificationclick', handleNotificationClick);
    }
  }, []);

  return {
    permission,
    requestPermission,
    notificationError,
  };
}
