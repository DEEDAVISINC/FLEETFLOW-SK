# FleetFlow Notification Sound Files

This directory contains department-specific notification sounds for the FleetFlow notification system.

## Required Sound Files

The following MP3 files are required for the notification system to work properly:

### Department-Specific Sounds
- `dispatcher-chime.mp3` - Notification sound for dispatcher department
- `broker-alert.mp3` - Notification sound for broker department  
- `driver-beep.mp3` - Notification sound for driver department
- `admin-tone.mp3` - Notification sound for admin department
- `carrier-notification.mp3` - Notification sound for carrier department

### Fallback Sound
- `notification-bell.mp3` - Generic fallback notification sound

## Sound Specifications

- **Format**: MP3
- **Duration**: 1-3 seconds recommended
- **Volume**: Normalized to prevent audio distortion
- **Bit Rate**: 128 kbps or higher

## Usage

These sounds are automatically played when notifications are received based on the user's department. The system uses HTML5 Audio API with priority-based volume control:

- **Critical Priority**: 80% volume
- **Normal Priority**: 50% volume

## Implementation

The sounds are loaded and played by the `GlobalNotificationBell` component:

```typescript
const DEPARTMENT_SOUNDS = {
  dispatcher: '/sounds/dispatcher-chime.mp3',
  broker: '/sounds/broker-alert.mp3', 
  driver: '/sounds/driver-beep.mp3',
  admin: '/sounds/admin-tone.mp3',
  carrier: '/sounds/carrier-notification.mp3'
}
```

## Adding Sound Files

To add the actual sound files:

1. Record or obtain appropriate notification sounds
2. Convert to MP3 format if needed
3. Place in this directory with the exact filenames listed above
4. Test the notification system to ensure proper playback

## Current Status

⚠️ **Sound files are currently missing** - The notification system will work without audio until these files are added. 