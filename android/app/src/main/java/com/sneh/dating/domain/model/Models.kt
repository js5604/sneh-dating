package com.sneh.dating.domain.model

import com.google.firebase.Timestamp

/**
 * Core User account entity storing private credentials, verification flags,
 * and DPDP (India Digital Personal Data Protection) compliance consent state.
 */
data class User(
    val id: String = "",
    val phoneNumber: String? = null,
    val email: String? = null,
    val isPhoneVerified: Boolean = false,
    val isAgeVerified: Boolean = false,
    val dpdpConsentGiven: Boolean = false,
    val dpdpConsentTimestamp: Long = 0L,
    val isBanned: Boolean = false,
    val isSuspended: Boolean = false,
    val subscriptionTier: SubscriptionTier = SubscriptionTier.FREE,
    val govtVerification: GovtIdVerification? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val lastActiveAt: Long = System.currentTimeMillis()
)

enum class SubscriptionTier {
    FREE,
    SHAHI_PREMIUM, // Sneh Shahi VIP
    SHAHI_ROYAL
}

/**
 * Official Online Government ID Verification Model.
 * Supports Aadhaar Card, PAN Card, Indian Passport, and Voter ID.
 * Notice: Full plaintext numbers are NEVER stored; only masked representations
 * and UIDAI / DigiLocker verification hashes are maintained.
 */
data class GovtIdVerification(
    val isVerified: Boolean = false,
    val docType: GovtDocType = GovtDocType.AADHAAR,
    val maskedNumber: String = "", // e.g. XXXX-XXXX-9281
    val verifiedAt: String = "",
    val badgeLevel: String = "DigiLocker Verified"
)

enum class GovtDocType {
    AADHAAR,
    PAN_CARD,
    PASSPORT,
    VOTER_ID
}

/**
 * Public Dating Profile representation shown in Discovery cards.
 * Notice: Only approximate location (city/neighborhood + approx km) is exposed;
 * exact GPS coordinates are NEVER exposed to another user.
 */
data class Profile(
    val id: String = "",
    val displayName: String = "",
    val age: Int = 18,
    val birthDate: String = "", // Age + DOB (e.g. 1999-04-12)
    val gender: String = "Woman", // Woman, Man, Non-Binary
    val datingPreference: String = "Everyone",
    val city: String = "Mumbai",
    val approximateArea: String = "Bandra West",
    val approximateDistanceKm: Int = 3,
    val photoUrls: List<String> = emptyList(),
    val bio: String = "",
    val profession: String = "",
    val education: String = "",
    val heightCm: Int? = null,
    val languages: List<String> = listOf("English", "Punjabi", "Hindi"),
    val interests: List<String> = emptyList(),
    val relationshipIntention: RelationshipIntention = RelationshipIntention.LONG_TERM,

    // Optional Indian Matchmaking Details
    val religion: String? = "Sikh", // Sikh, Hindu, Muslim, Christian, Jain, Buddhist, Other
    val caste: String? = "Jatt",   // Jatt, Khatri, Arora, Ramgarhia, Saini, Kamboj, Rajput, Brahmin, etc.
    val maritalStatus: MaritalStatus = MaritalStatus.NEVER_MARRIED,
    val showOptionalDetails: Boolean = true,

    // Govt ID Verification Status
    val govtVerification: GovtIdVerification? = null,

    val lifestyle: LifestylePreferences = LifestylePreferences(),
    val isVerified: Boolean = false,
    val verificationType: VerificationType = VerificationType.NONE,
    val visibility: ProfileVisibility = ProfileVisibility.PUBLIC,
    val showApproximateDistance: Boolean = true,
    val incognitoMode: Boolean = false
)

enum class MaritalStatus(val labelEn: String, val labelPa: String) {
    NEVER_MARRIED("Never Married", "ਅਣਵਿਆਹਿਆ"),
    DIVORCED("Divorced", "ਤਲਾਕਸ਼ੁਦਾ"),
    AWAITING_DIVORCE("Awaiting Divorce", "ਤਲਾਕ ਦੀ ਉਡੀਕ"),
    WIDOWED("Widowed", "ਵਿਧਵਾ / ਵਿਧੁਰ")
}

enum class RelationshipIntention(val labelEn: String, val labelPa: String) {
    LONG_TERM("Long-term relationship", "ਲੰਬੇ ਸਮੇਂ ਦਾ ਰਿਸ਼ਤਾ"),
    MARRIAGE_MINDED("Marriage minded", "ਵਿਆਹ ਲਈ ਗੰਭੀਰ"),
    DATING_EXPLORATION("Thoughtful dating", "ਸੋਚ-ਸਮਝ ਕੇ ਡੇਟਿੰਗ"),
    NEW_FRIENDS("Deep friendship first", "ਪਹਿਲਾਂ ਡੂੰਘੀ ਦੋਸਤੀ")
}

data class LifestylePreferences(
    val diet: String = "Vegetarian", // Pure Veg, Eggetarian, Non-Veg, Vegan, Jain
    val drinking: String = "Never", // Never, Socially, Regularly
    val smoking: String = "Never", // Never, Occasionally, Yes
    val fitness: String = "Yoga & Gym",
    val pets: String = "Dog lover",
    val communityPreference: String? = null // Optional cultural / heritage affinity
)

enum class VerificationType {
    NONE,
    SELFIE_BIOMETRIC,
    PHONE_OTP,
    GOVT_ID_ONLINE_VERIFY // Aadhaar, PAN, Passport via DigiLocker / UIDAI
}

enum class ProfileVisibility {
    PUBLIC,
    PAUSED, // Pauses new incoming discovery without deleting history
    INCOGNITO // Only seen by profiles user has actively liked
}

/**
 * Match record representing mutual affinity between two verified users.
 */
data class Match(
    val id: String = "",
    val users: List<String> = emptyList(),
    val matchedProfile: Profile? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val lastMessageText: String? = null,
    val lastMessageTimestamp: Long? = null,
    val hasUnreadMessages: Boolean = false
)

/**
 * Rich Media Chat Message supporting Text, Photos, Video clips, and Live Location sharing.
 */
data class Message(
    val id: String = "",
    val conversationId: String = "",
    val senderId: String = "",
    val text: String = "",
    val messageType: MessageType = MessageType.TEXT,
    val mediaUrl: String? = null,
    val locationData: LiveLocationData? = null,
    val timestamp: Long = System.currentTimeMillis(),
    val isRead: Boolean = false,
    val containsSuspiciousFinancialTrigger: Boolean = false, // Auto-flagged if money/OTP requested
    val replyToMessageId: String? = null
)

enum class MessageType {
    TEXT,
    IMAGE,
    VIDEO,
    LIVE_LOCATION
}

data class LiveLocationData(
    val placeName: String = "",
    val approximateArea: String = "",
    val durationMinutes: Int = 30,
    val expiresAtTimestamp: Long = 0L
)

/**
 * Safety Report supporting India grievance redressal mechanisms and Google Play UGC policies.
 */
data class SafetyReport(
    val reportId: String = "",
    val reporterId: String = "",
    val reportedUserId: String = "",
    val reasonCategory: ReportCategory = ReportCategory.SCAM_OR_FRAUD,
    val optionalDescription: String = "",
    val evidenceUrls: List<String> = emptyList(),
    val submittedAt: Long = System.currentTimeMillis(),
    val status: ReportStatus = ReportStatus.PENDING_REVIEW
)

enum class ReportCategory(val displayName: String) {
    SCAM_OR_FRAUD("Scam / Demanding Money or UPI"),
    HARASSMENT("Harassment or Bullying"),
    FAKE_PROFILE("Fake Profile / Impersonation"),
    UNDERAGE_USER("Suspected Underage User (Under 18)"),
    INAPPROPRIATE_CONTENT("Unsolicited Explicit Content"),
    HATE_SPEECH("Hate Speech or Religious/Caste Abuse"),
    EXTORTION_BLACKMAIL("Blackmail or Threat"),
    OTHER("Other Violation")
}

enum class ReportStatus {
    PENDING_REVIEW,
    UNDER_INVESTIGATION,
    RESOLVED_NO_ACTION,
    RESOLVED_USER_WARNED,
    RESOLVED_USER_SUSPENDED,
    RESOLVED_USER_BANNED
}

/**
 * Owner-Only App Monetisation Configuration Entity
 * Restricted exclusively to owner: Jatindersingh5604@gmail.com
 */
data class OwnerMonetisation(
    val ownerEmail: String = "Jatindersingh5604@gmail.com",
    val enableGooglePlayBilling: Boolean = true,
    val enableRewardedAds: Boolean = true,
    val enableInterstitialAds: Boolean = false,
    val enableDiscoveryBanners: Boolean = true,
    val enableProfileBoost: Boolean = true,
    val oneMonthPriceInr: Int = 799,
    val threeMonthsPriceInr: Int = 1499,
    val twelveMonthsPriceInr: Int = 3599
)
