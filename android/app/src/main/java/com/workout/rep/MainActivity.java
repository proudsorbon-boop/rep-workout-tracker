package com.workout.rep;

import android.os.Bundle;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        createNotificationChannels();
    }
    
    private void createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager == null) {
                return;
            }
            
            // Канал для напоминаний о тренировках
            NotificationChannel workoutChannel = new NotificationChannel(
                "workout_channel",
                "Workout Reminders",
                NotificationManager.IMPORTANCE_HIGH
            );
            workoutChannel.setDescription("Daily workout reminder notifications");
            workoutChannel.enableVibration(true);
            workoutChannel.enableLights(true);
            workoutChannel.setShowBadge(true);
            workoutChannel.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);
            // Ensure notifications show on lock screen even when DND is on
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                workoutChannel.setBypassDnd(false); // false means it respects DND, true would bypass
            }
            
            // Дефолтный канал - also configured for lock screen visibility
            NotificationChannel defaultChannel = new NotificationChannel(
                "default",
                "Default Notifications",
                NotificationManager.IMPORTANCE_HIGH  // Changed to HIGH to ensure lock screen visibility
            );
            defaultChannel.setDescription("Default notification channel");
            defaultChannel.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);
            defaultChannel.enableVibration(true);
            defaultChannel.enableLights(true);
            
            manager.createNotificationChannel(workoutChannel);
            manager.createNotificationChannel(defaultChannel);
        }
    }
}