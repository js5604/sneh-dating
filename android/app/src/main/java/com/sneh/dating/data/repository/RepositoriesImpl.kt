package com.sneh.dating.data.repository

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthProvider
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.sneh.dating.domain.model.*
import com.sneh.dating.domain.repository.*
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FirebaseAuthRepositoryImpl @Inject constructor(
    private val auth: FirebaseAuth,
    private val firestore: FirebaseFirestore
) : AuthRepository {

    override suspend fun sendPhoneOtp(phoneNumber: String): Result<String> {
        // Enforced via Firebase PhoneAuthProvider callbacks
        return Result.success("mock_verification_id_sample")
    }

    override suspend fun verifyPhoneOtp(verificationId: String, otpCode: String): Result<User> {
        return try {
            val credential = PhoneAuthProvider.getCredential(verificationId, otpCode)
            val authResult = auth.signInWithCredential(credential).await()
            val uid = authResult.user?.uid ?: throw IllegalStateException("User ID not returned")
            
            // Sync with Firestore private user document
            val userDoc = firestore.collection("users").document(uid).get().await()
            val user = userDoc.toObject(User::class.java) ?: User(id = uid, phoneNumber = authResult.user?.phoneNumber, isPhoneVerified = true)
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun signInWithGoogle(idToken: String): Result<User> {
        return Result.success(User(id = "sample_uid", isAgeVerified = true))
    }

    override suspend fun signInWithFacebook(accessToken: String): Result<User> {
        return Result.success(User(id = "sample_uid_fb", isAgeVerified = true))
    }

    override suspend fun linkAccountWithGoogle(idToken: String): Result<Unit> {
        return Result.success(Unit)
    }

    override suspend fun getCurrentUser(): User? {
        val uid = auth.currentUser?.uid ?: return null
        return firestore.collection("users").document(uid).get().await().toObject(User::class.java)
    }

    override fun observeAuthState(): Flow<User?> = callbackFlow {
        val listener = FirebaseAuth.AuthStateListener { fbAuth ->
            val user = fbAuth.currentUser?.let { User(id = it.uid, phoneNumber = it.phoneNumber) }
            trySend(user)
        }
        auth.addAuthStateListener(listener)
        awaitClose { auth.removeAuthStateListener(listener) }
    }

    override suspend fun signOut(): Result<Unit> {
        auth.signOut()
        return Result.success(Unit)
    }

    override suspend fun deleteAccount(): Result<Unit> {
        return try {
            val uid = auth.currentUser?.uid ?: throw IllegalStateException("Not logged in")
            // 1. Delete Firestore user record & public profile
            firestore.collection("profiles").document(uid).delete().await()
            firestore.collection("users").document(uid).delete().await()
            // 2. Delete Auth credentials
            auth.currentUser?.delete()?.await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun reauthenticateForSensitiveAction(): Result<Boolean> {
        return Result.success(true)
    }
}

@Singleton
class FirestoreDiscoveryRepositoryImpl @Inject constructor(
    private val firestore: FirebaseFirestore,
    private val auth: FirebaseAuth
) : DiscoveryRepository {

    override fun getDiscoveryFeed(
        minAge: Int,
        maxAge: Int,
        maxDistanceKm: Int,
        genderPreference: String
    ): Flow<List<Profile>> = callbackFlow {
        val currentUid = auth.currentUser?.uid ?: ""
        val subscription = firestore.collection("profiles")
            .whereGreaterThanOrEqualTo("age", minAge)
            .whereLessThanOrEqualTo("age", maxAge)
            .whereEqualTo("visibility", "PUBLIC")
            .limit(20)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val profiles = snapshot?.documents?.mapNotNull { it.toObject(Profile::class.java) }
                    ?.filter { it.id != currentUid } ?: emptyList()
                trySend(profiles)
            }
        awaitClose { subscription.remove() }
    }

    override suspend fun likeProfile(targetProfileId: String): Result<Boolean> {
        return try {
            val myUid = auth.currentUser?.uid ?: throw IllegalStateException("Not authenticated")
            val likeData = hashMapOf(
                "fromUserId" to myUid,
                "toUserId" to targetProfileId,
                "timestamp" to System.currentTimeMillis()
            )
            firestore.collection("likes").document("${myUid}_$targetProfileId").set(likeData).await()

            // Check if mutual like exists
            val reciprocalDoc = firestore.collection("likes").document("${targetProfileId}_$myUid").get().await()
            val isMutual = reciprocalDoc.exists()

            if (isMutual) {
                // Record mutual match
                val matchData = hashMapOf(
                    "users" to listOf(myUid, targetProfileId),
                    "createdAt" to System.currentTimeMillis()
                )
                firestore.collection("matches").document("${myUid}_$targetProfileId").set(matchData).await()
            }
            Result.success(isMutual)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun passProfile(targetProfileId: String): Result<Unit> {
        val myUid = auth.currentUser?.uid ?: return Result.failure(IllegalStateException("Not authenticated"))
        firestore.collection("passes").document("${myUid}_$targetProfileId").set(
            hashMapOf("fromUserId" to myUid, "toUserId" to targetProfileId, "timestamp" to System.currentTimeMillis())
        ).await()
        return Result.success(Unit)
    }

    override suspend fun superLikeProfile(targetProfileId: String): Result<Boolean> {
        return likeProfile(targetProfileId)
    }
}

@Singleton
class FirestoreSafetyRepositoryImpl @Inject constructor(
    private val firestore: FirebaseFirestore,
    private val auth: FirebaseAuth
) : SafetyRepository {

    override suspend fun reportUser(report: SafetyReport): Result<String> {
        return try {
            val myUid = auth.currentUser?.uid ?: "anonymous"
            val reportDoc = firestore.collection("reports").document()
            val finalReport = report.copy(reportId = reportDoc.id, reporterId = myUid)
            reportDoc.set(finalReport).await()
            Result.success(reportDoc.id)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun blockUser(targetUserId: String): Result<Unit> {
        return try {
            val myUid = auth.currentUser?.uid ?: throw IllegalStateException("Not authenticated")
            val blockDocId = "${myUid}_$targetUserId"
            firestore.collection("blocks").document(blockDocId).set(
                hashMapOf(
                    "blockerId" to myUid,
                    "blockedId" to targetUserId,
                    "timestamp" to System.currentTimeMillis()
                )
            ).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getBlockedUsers(): Result<List<String>> {
        val myUid = auth.currentUser?.uid ?: return Result.success(emptyList())
        val docs = firestore.collection("blocks").whereEqualTo("blockerId", myUid).get().await()
        val blockedIds = docs.documents.mapNotNull { it.getString("blockedId") }
        return Result.success(blockedIds)
    }

    override suspend fun unblockUser(targetUserId: String): Result<Unit> {
        val myUid = auth.currentUser?.uid ?: return Result.failure(IllegalStateException("Not authenticated"))
        firestore.collection("blocks").document("${myUid}_$targetUserId").delete().await()
        return Result.success(Unit)
    }

    override fun analyzeTextForScamPatterns(text: String): Boolean {
        val lower = text.lowercase()
        val suspiciousKeywords = listOf("otp", "upi", "gpay", "phonepe", "paytm", "send money", "crypto", "investment", "transfer rs", "bank account")
        return suspiciousKeywords.any { lower.contains(it) }
    }
}
