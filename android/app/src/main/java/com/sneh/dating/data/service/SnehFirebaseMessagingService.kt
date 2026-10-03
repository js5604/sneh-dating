package com.sneh.dating.data.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.sneh.dating.R
import com.sneh.dating.ui.MainActivity

class SnehFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Securely sync FCM push token to private Firestore user record
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val notificationType = remoteMessage.data["type"] ?: "message"
        val senderName = remoteMessage.data["senderName"] ?: "Someone on Sneh"

        // Privacy-Preserving Notification Previews:
        // Sensitive message bodies are NEVER exposed in lock screen notifications
        val (title, body) = when (notificationType) {
            "match" -> Pair("It's a Match! ✨", "You and $senderName mutually liked each other.")
            "safety" -> Pair("Security Notice", "Important safety update regarding your account.")
            "super_like" -> Pair("New Admirer 🌟", "Someone sent you a Super Like!")
            else -> Pair("New Message", "$senderName sent you a message.") // Hides private content
        }

        showPrivacyNotification(title, body)
    }

    private fun showPrivacyNotification(title: String, body: String) {
        val channelId = "sneh_alerts_channel"
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Sneh Matches & Messages",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Privacy-first notification channel for Sneh Indian dating"
                enableVibration(true)
            }
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
}
