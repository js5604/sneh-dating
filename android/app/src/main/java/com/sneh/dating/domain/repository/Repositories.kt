package com.sneh.dating.domain.repository

import com.sneh.dating.domain.model.*
import kotlinx.coroutines.flow.Flow

/**
 * Clean Architecture Repositories for Sneh Android Dating Application
 */

interface AuthRepository {
    suspend fun sendPhoneOtp(phoneNumber: String): Result<String> // Returns verificationId
    suspend fun verifyPhoneOtp(verificationId: String, otpCode: String): Result<User>
    suspend fun signInWithGoogle(idToken: String): Result<User>
    suspend fun signInWithFacebook(accessToken: String): Result<User>
    suspend fun linkAccountWithGoogle(idToken: String): Result<Unit>
    suspend fun getCurrentUser(): User?
    fun observeAuthState(): Flow<User?>
    suspend fun signOut(): Result<Unit>
    suspend fun deleteAccount(): Result<Unit>
    suspend fun reauthenticateForSensitiveAction(): Result<Boolean>
}

interface ProfileRepository {
    suspend fun getProfile(userId: String): Result<Profile>
    suspend fun updateProfile(profile: Profile): Result<Unit>
    suspend fun uploadPhoto(bytes: ByteArray, position: Int): Result<String>
    suspend fun deletePhoto(photoUrl: String): Result<Unit>
    suspend fun reorderPhotos(photoUrls: List<String>): Result<Unit>
    suspend fun requestVerification(selfieImageBytes: ByteArray): Result<Unit>
    suspend fun setVisibility(visibility: ProfileVisibility): Result<Unit>
}

interface DiscoveryRepository {
    fun getDiscoveryFeed(
        minAge: Int = 18,
        maxAge: Int = 40,
        maxDistanceKm: Int = 50,
        genderPreference: String = "Everyone"
    ): Flow<List<Profile>>

    suspend fun likeProfile(targetProfileId: String): Result<Boolean> // Returns true if mutual match triggered
    suspend fun passProfile(targetProfileId: String): Result<Unit>
    suspend fun superLikeProfile(targetProfileId: String): Result<Boolean>
}

interface ChatRepository {
    fun observeMatches(): Flow<List<Match>>
    fun observeMessages(conversationId: String): Flow<List<Message>>
    suspend fun sendMessage(conversationId: String, text: String, replyToId: String? = null): Result<Message>
    suspend fun deleteOwnMessage(conversationId: String, messageId: String): Result<Unit>
    suspend fun unmatchUser(matchId: String): Result<Unit>
}

interface SafetyRepository {
    suspend fun reportUser(report: SafetyReport): Result<String> // Returns formal Report ID
    suspend fun blockUser(targetUserId: String): Result<Unit>
    suspend fun getBlockedUsers(): Result<List<String>>
    suspend fun unblockUser(targetUserId: String): Result<Unit>
    fun analyzeTextForScamPatterns(text: String): Boolean // Detects UPI, bank, OTP scam patterns
}

interface PrivacyRepository {
    suspend fun recordDpdpConsent(consent: DpdpConsentRecord): Result<Unit>
    suspend fun withdrawConsent(): Result<Unit>
    suspend fun exportUserData(): Result<String> // Prepares GDPR/DPDP export file
    suspend fun updateLocationPrivacy(showApproximateDistance: Boolean): Result<Unit>
    suspend fun toggleIncognitoMode(enabled: Boolean): Result<Unit>
}
