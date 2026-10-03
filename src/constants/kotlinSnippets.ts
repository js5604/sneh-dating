import { KotlinCodeSnippet } from '../types/dating';

export const kotlinCodeSnippets: Record<string, KotlinCodeSnippet> = {
  discovery: {
    fileName: 'DiscoveryScreen.kt',
    filePath: 'com/sneh/dating/ui/screens/discovery/DiscoveryScreen.kt',
    language: 'kotlin',
    code: `@Composable
fun DiscoveryScreen(
    profiles: List<Profile>,
    onLike: (Profile) -> Unit,
    onPass: (Profile) -> Unit,
    onSuperLike: (Profile) -> Unit
) {
    var currentIndex by remember { mutableIntStateOf(0) }
    val profile = profiles.getOrNull(currentIndex)

    Card(
        modifier = Modifier.fillMaxWidth().fillMaxHeight(0.85f),
        shape = RoundedCornerShape(28.dp)
    ) {
        AsyncImage(
            model = profile?.photoUrls?.firstOrNull(),
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
        // Age + DOB & Optional Matchmaking Badges
        Text(
            text = "\${profile?.displayName}, \${profile?.age} • Born \${profile?.birthDate}",
            color = Color.White,
            fontWeight = FontWeight.Bold
        )
        Row {
            profile?.caste?.let { AssistChip(onClick = {}, label = { Text(it) }) }
            profile?.religion?.let { AssistChip(onClick = {}, label = { Text(it) }) }
            AssistChip(onClick = {}, label = { Text(profile?.maritalStatus?.labelEn ?: "") })
        }
    }
}`,
    explanation: 'Jetpack Compose Discovery deck rendering Age + DOB, Caste (Jatt, Khatri, Brahmin, etc.), Religion (Sikh, Hindu, Muslim), Marital status, and Govt ID Verified badges.'
  },
  verification: {
    fileName: 'GovtVerificationScreen.kt',
    filePath: 'com/sneh/dating/ui/screens/verification/GovtVerificationScreen.kt',
    language: 'kotlin',
    code: `@Composable
fun GovtVerificationScreen(
    onVerifyAadhaar: (String) -> Unit,
    onVerifyPan: (String) -> Unit,
    onVerifyPassport: (String) -> Unit
) {
    // Online Govt ID Verification via UIDAI OTP / DigiLocker / NSDL
    Column {
        DocOptionCard(
            title = "Aadhaar Card (UIDAI / DigiLocker)",
            description = "Instant 6-digit OTP verification. Number is masked under UIDAI regulations.",
            badge = "DigiLocker Verified"
        )
        DocOptionCard(
            title = "PAN Card (Income Tax Department)",
            description = "Instant NSDL database match with legal name & DOB.",
            badge = "Govt Approved"
        )
        DocOptionCard(
            title = "Indian Passport",
            description = "Passport Seva authentication for verified NRIs and Indian residents.",
            badge = "Govt Approved"
        )
    }
}`,
    explanation: 'Online Government ID verification interface securely validating Aadhaar, PAN, Passport, or Voter ID through official APIs without storing raw plaintext numbers.'
  },
  owner_monetisation: {
    fileName: 'OwnerMonetisationManager.kt',
    filePath: 'com/sneh/dating/data/monetisation/OwnerMonetisationManager.kt',
    language: 'kotlin',
    code: `class OwnerMonetisationManager @Inject constructor(
    private val firestore: FirebaseFirestore,
    private val auth: FirebaseAuth
) {
    // Restricted strictly to sole app owner
    val OWNER_EMAIL = "Jatindersingh5604@gmail.com"

    fun canManageMonetisation(): Boolean {
        return auth.currentUser?.email == OWNER_EMAIL
    }

    suspend fun updateAdMobAndBillingConfig(config: OwnerMonetisation) {
        if (!canManageMonetisation()) throw SecurityException("Unauthorized owner access.")
        firestore.collection("ownerConfig").document("monetisation").set(config).await()
    }
}`,
    explanation: 'Owner-Only Monetisation Architecture for Jatindersingh5604@gmail.com: restricts AdMob rewarded video ads, interstitial frequency, and Google Play billing prices to owner.'
  },
  chat: {
    fileName: 'ChatScreen.kt',
    filePath: 'com/sneh/dating/ui/screens/chat/ChatScreen.kt',
    language: 'kotlin',
    code: `@Composable
fun ChatScreen(
    recipientProfile: Profile,
    messages: List<Message>,
    onShareLiveLocation: () -> Unit,
    onSendPhoto: (Uri) -> Unit,
    onSendVideo: (Uri) -> Unit
) {
    // Rich Media Messaging: Live Location sharing + Photos + Videos
    LazyColumn {
        items(messages) { msg ->
            when (msg.messageType) {
                MessageType.LIVE_LOCATION -> LiveLocationBubble(msg.locationData)
                MessageType.IMAGE -> ImageAttachmentBubble(msg.mediaUrl)
                MessageType.VIDEO -> VideoAttachmentBubble(msg.mediaUrl)
                MessageType.TEXT -> TextMessageBubble(msg.text)
            }
        }
    }
}`,
    explanation: 'Real-time Compose chat with Live Location sharing for date safety, photo uploads, video previews, and automated heuristic scam alerts.'
  },
  safety: {
    fileName: 'SafetyCenterScreen.kt',
    filePath: 'com/sneh/dating/ui/screens/safety/SafetyCenterScreen.kt',
    language: 'kotlin',
    code: `@Composable
fun SafetyCenterScreen() {
    EmergencyContactRow(
        title = "112 - All-in-One Emergency",
        subtitle = "Police, Fire, Ambulance (All India)",
        icon = Icons.Outlined.LocalPolice,
        onDial = {
            val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:112"))
            context.startActivity(intent)
        }
    )
    EmergencyContactRow(
        title = "1091 / 181 - Women Safety Helpline",
        subtitle = "National Commission for Women 24/7 Helpline",
        icon = Icons.Outlined.SupportAgent,
        onDial = {
            val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:1091"))
            context.startActivity(intent)
        }
    )
}`,
    explanation: 'Dedicated Android Safety Center integrating immediate intent dialers for Indian national emergency services (112, 1091, 1930 Cyber Crime) and in-person meeting guidelines.'
  },
  privacy: {
    fileName: 'PrivacyDashboardScreen.kt',
    filePath: 'com/sneh/dating/ui/screens/privacy/PrivacyDashboardScreen.kt',
    language: 'kotlin',
    code: `@Composable
fun PrivacyDashboardScreen(
    approximateDistanceOnly: Boolean,
    onToggleApproximateDistance: (Boolean) -> Unit,
    incognitoMode: Boolean,
    onToggleIncognito: (Boolean) -> Unit,
    onDeleteAccount: () -> Unit
) {
    PrivacySwitchRow(
        title = stringResource(R.string.privacy_approx_loc),
        checked = approximateDistanceOnly,
        onCheckedChange = onToggleApproximateDistance
    )
    PrivacySwitchRow(
        title = stringResource(R.string.privacy_incognito),
        checked = incognitoMode,
        onCheckedChange = onToggleIncognito
    )
    Button(
        onClick = onDeleteAccount,
        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
    ) {
        Text("Delete Account & All Personal Data")
    }
}`,
    explanation: 'Enforces statutory compliance with India DPDP Act: granular consent control, incognito browsing, data download request, and irrevocable account deletion.'
  },
  firestoreRules: {
    fileName: 'firestore.rules',
    filePath: 'firestore.rules',
    language: 'javascript',
    code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Owner Monetisation & Ads: Exclusively Jatindersingh5604@gmail.com
    match /ownerConfig/{configDoc} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == 'Jatindersingh5604@gmail.com';
    }
    // Govt ID Verification metadata (masked tokens only)
    match /govtVerifications/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Public Profiles with Optional Details
    match /profiles/{userId} {
      allow read: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == userId;
    }
  }
}`,
    explanation: 'Production Firestore security rules isolating private user data, ensuring owner-only access for Jatindersingh5604@gmail.com, and safeguarding Govt ID metadata.'
  }
};
