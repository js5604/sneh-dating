# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /opt/android-sdk/tools/proguard/proguard-android.txt

# Keep data classes and models for serialization
-keep class com.sneh.dating.domain.model.** { *; }
-keep class com.sneh.dating.data.remote.model.** { *; }

# Firebase Firestore and Auth
-keepattributes *Annotation*
-dontwarn com.google.firebase.**
-keep class com.google.firebase.** { *; }

# Kotlin Coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}

# Hilt & Dagger
-dontwarn com.google.errorprone.annotations.**
