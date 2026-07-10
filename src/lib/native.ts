import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Toast } from '@capacitor/toast';
import { Device } from '@capacitor/device';

// Check if running on native Android/iOS
export const isNative = () => Capacitor.isNativePlatform();

/**
 * Trigger native haptic feedback vibration
 * @param type 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'
 */
export async function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
  if (!isNative()) {
    // Web fallback using standard navigator.vibrate
    if ('vibrate' in navigator) {
      try {
        if (type === 'light') navigator.vibrate(15);
        else if (type === 'medium') navigator.vibrate(30);
        else if (type === 'heavy') navigator.vibrate(60);
        else if (type === 'success') navigator.vibrate([20, 40, 20]);
        else if (type === 'error') navigator.vibrate([50, 50, 100]);
      } catch (e) {
        // Safe no-op for browsers blocking vibration without user action
      }
    }
    return;
  }

  try {
    switch (type) {
      case 'light':
        await Haptics.impact({ style: ImpactStyle.Light });
        break;
      case 'medium':
        await Haptics.impact({ style: ImpactStyle.Medium });
        break;
      case 'heavy':
        await Haptics.impact({ style: ImpactStyle.Heavy });
        break;
      case 'success':
        await Haptics.notification({ type: NotificationType.Success });
        break;
      case 'warning':
        await Haptics.notification({ type: NotificationType.Warning });
        break;
      case 'error':
        await Haptics.notification({ type: NotificationType.Error });
        break;
    }
  } catch (err) {
    console.error('Haptics failed:', err);
  }
}

/**
 * Show native Android Toast popup
 * @param text Message to display
 * @param duration 'short' | 'long'
 */
export async function showNativeToast(text: string, duration: 'short' | 'long' = 'short') {
  if (!isNative()) {
    console.log(`[TOAST FALLBACK] ${text}`);
    return;
  }

  try {
    await Toast.show({
      text,
      duration: duration === 'long' ? 'long' : 'short',
      position: 'bottom',
    });
  } catch (err) {
    console.error('Toast failed:', err);
  }
}

/**
 * Fetch native device battery and hardware details
 */
export async function getNativeBatteryAndHardware() {
  const result = {
    isNative: isNative(),
    batteryLevel: 98,
    batteryStatus: 'DISCHARGING' as 'CHARGING' | 'DISCHARGING',
    ramTotal: 8.0,
    ramUsed: 4.2,
    model: 'Browser Client',
    manufacturer: 'Web'
  };

  try {
    const batteryInfo = await Device.getBatteryInfo();
    if (batteryInfo && batteryInfo.batteryLevel !== undefined) {
      result.batteryLevel = Math.round(batteryInfo.batteryLevel * 100);
      result.batteryStatus = batteryInfo.isCharging ? 'CHARGING' : 'DISCHARGING';
    }

    const info = await Device.getInfo();
    if (info) {
      result.model = info.model || 'Unknown Android';
      result.manufacturer = info.manufacturer || 'Google';
    }
  } catch (err) {
    console.warn('Could not read native device details, using web fallback:', err);
  }

  return result;
}
