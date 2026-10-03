# Sneh (ਸਨੇਹ) - Premium Native Android Dating Application

A modern, safe, privacy-first native Android dating and matchmaking application tailored for the Indian market, built with **Kotlin**, **Jetpack Compose**, **Material 3**, **Clean Architecture**, and **Firebase**.

---

## 1. Architecture Summary

Sneh is architected strictly following Google's official Android Architecture Guidelines:

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Layer (Jetpack Compose)               │
│  - Screens: Onboarding, Auth (+91 OTP), Profile, Discovery, │
│             Chat, Safety Center, Privacy Dashboard, Shahi   │
│  - Material 3 Design System (Royal Ruby & Kesari Gold)      │
│  - Localization: English & Punjabi (ਪੰਜਾਬੀ), Hindi-ready    │
└──────────────────────────────┬──────────────────────────────┘
                               │ StateFlow / Events
┌──────────────────────────────▼──────────────────────────────┐
│                 Presentation (MVVM ViewModels)              │
│  - AuthViewModel, DiscoveryViewModel, ChatViewModel, etc.   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Coroutines & Flow
┌──────────────────────────────▼──────────────────────────────┐
│                      Domain Layer (Pure Kotlin)             │
│  - Models: User, Profile, Match, Message, SafetyReport      │
│  - Repositories: AuthRepository, DiscoveryRepository, etc.  │
│  - UseCases: CalculateEligibility, DetectScamPatterns       │
└──────────────────────────────┬──────────────────────────────┘
                               │ Interfaces
┌──────────────────────────────▼──────────────────────────────┐
│                    Data Layer (Firebase & Local)            │
│  - Firebase Authentication (Phone OTP, Google, Facebook)    │
│  - Cloud Firestore (Real-time sync, offline persistence)    │
│  - Firebase Storage (Media compression & CDN)               │
│  - DataStore (Local privacy flags & DPDP consent cache)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Firebase Services Required

1. **Firebase Authentication**:
   - Phone Authentication (Indian `+91` SMS OTP with Play Integrity App Check verification)
   - Google Sign-In (Credential Manager API)
   - Facebook Login
   - Account Linking
2. **Cloud Firestore**:
   - Document database for users, discovery profiles, matches, real-time chats, reports, and blocks.
3. **Firebase Storage**:
   - Secure bucket for user profile photos with client-side compression and moderation triggers.
4. **Firebase Cloud Messaging (FCM)**:
   - High-priority background notifications for new matches, messages, and safety alerts without exposing sensitive preview text.
5. **Firebase App Check**:
   - Enforcing **Play Integrity API** on Android to block bot farms, emulators, and reverse-engineered API access.

---

## 3. Firestore Collections Schema

| Collection | Document ID | Purpose | Security Restriction |
|---|---|---|---|
| `/users/{userId}` | Firebase Auth UID | Private user metadata, DPDP consent, account status | Owner & Admin only |
| `/profiles/{userId}` | Firebase Auth UID | Public discovery card data, approximate location | Public (if age verified & not blocked) |
| `/likes/{likeId}` | `${fromUid}_${toUid}` | Swiped right signals | Sender & Recipient only |
| `/passes/{passId}` | `${fromUid}_${toUid}` | Swiped left signals | Sender only |
| `/matches/{matchId}` | `${uid1}_${uid2}` | Mutual match record | Participants only |
| `/conversations/{id}/messages/{msgId}` | Auto-ID | Real-time chat messages | Conversation participants only |
| `/reports/{reportId}` | Auto-ID | User reports & violation evidence | Write-only for reporter; Admin read |
| `/blocks/{blockId}` | `${blockerId}_${blockedId}` | Mutual block mapping | Blocker & Admin only |
| `/consents/{consentId}` | Auto-ID | DPDP Act statutory consent trail | Owner & Admin only |

---

## 4. Security Rules Summary (`firestore.rules`)

- **Owner-Only Private Data**: Users can read and write only their own records in `/users/{userId}` and `/consents`.
- **Public Profile Isolation**: Internal moderation keys (`isVerified`, `isSuspended`, `verificationBadgeType`) cannot be altered by client-side writes.
- **Match Tampering Prevention**: Client cannot arbitrarily manufacture matches; matches require mutual likes or server-side Cloud Function execution.
- **Immediate Block Enforcement**: Firestore queries check the `/blocks/` collection to guarantee blocked individuals cannot read each other's profiles or send messages.
- **Immutable Safety Reports**: Once submitted by a user, reports cannot be altered or deleted by any non-admin user.

---

## 5. Required Firebase Console Configuration

1. In the **Firebase Console**, create project `sneh-dating-india`.
2. Add an Android app with package name `com.sneh.dating`.
3. Download `google-services.json` and place it inside `android/app/`.
4. Under **Authentication > Sign-in method**:
   - Enable **Phone**: Ensure test numbers with fixed OTPs are configured for Google Play review testing.
   - Enable **Google**: Provide your Web Client ID and Web Client Secret.
   - Enable **Facebook**: Provide your Facebook App ID and App Secret.
5. Under **App Check**:
   - Register your Android app and activate **Play Integrity** provider with your release signing SHA-256 fingerprint.

---

## 6. Required Google Play Console Configuration

1. **Target Audience & Age Gate**:
   - Target age: **18 and above only** (Strictly Adult/Dating classification).
   - Complete the IARC rating questionnaire accurately (dating apps typically receive a Mature 17+ or PEGI 18 rating).
2. **User Generated Content (UGC) Policy Compliance**:
   - In-app 12-category report system.
   - In-app immediate block button.
   - Terms of Service & Community Guidelines acceptance before user creation.
3. **Account Deletion Requirement (Play Store Rule)**:
   - Provide an in-app deletion button in Settings > Privacy Dashboard.
   - Provide an external web deletion request URL (e.g. `https://snehapp.in/delete-account`).
4. **Data Safety Form**:
   - Disclose data collection: Approximate Location (optional), Photos (profile), Phone number (auth), User IDs.
   - State that data is encrypted in transit (TLS) and users can request data deletion.

---

## 7. Required Facebook Developer Configuration

1. Create an app in **Meta for Developers** (Type: Consumer).
2. Add **Facebook Login for Android**.
3. Generate and paste your Android **Key Hash** (`keytool -exportcert -alias ... | openssl sha1 -binary | openssl base64`).
4. Request permissions: `email`, `public_profile`.

---

## 8. Required Google Sign-In Configuration

1. In **Google Cloud Console**, locate your Firebase-linked OAuth 2.0 Client IDs.
2. Register both **Debug SHA-1** and **Release SHA-1** fingerprints:
   ```bash
   ./gradlew signingReport
   ```
3. Use the **Web Client ID** in your Credential Manager / GoogleIdTokenRequestOptions on Android.

---

## 9. Required Legal Documents (India DPDP & IT Rules)

1. **Privacy Policy**: Plain language explanation of personal data collection, approximate location processing, photo moderation, and 18+ age criteria.
2. **Statutory Grievance Officer**: Required under India Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules:
   - *Grievance Officer Name*: Contact Person
   - *Designation*: Grievance Redressal Officer
   - *Email*: grievance@snehapp.in
   - *Postal Address*: Registered Office in India
   - *Turnaround Time*: Acknowledgment within 24 hours, resolution within 15 days.
3. **Terms of Service & Community Guidelines**: Zero tolerance for romance scams, extortion, commercial sex work, and underage usage.

---

## 10. Known Limitations

- **SMS OTP Delivery**: Depends on telecom carrier throughput; test numbers must be provided for app store review.
- **Biometric Photo Verification**: Initial client performs selfie capture; production scale requires automated liveness AI verification (e.g., face match score).
- **Google Play Billing**: Production testing requires publishing an internal test track build to Google Play with active in-app products.

---

## 11. Production Deployment Checklist

- [ ] Firebase `google-services.json` placed in `app/`.
- [ ] Production keystore created and stored in secure CI/CD secrets.
- [ ] Firestore Security Rules deployed via Firebase CLI (`firebase deploy --only firestore:rules`).
- [ ] Play Integrity enrolled in Firebase App Check.
- [ ] Static code analysis & ProGuard rules tested (`isMinifyEnabled = true`).
- [ ] Test accounts registered for Google Play Reviewers.
- [ ] Grievance Officer email and Indian address updated in legal pages.
