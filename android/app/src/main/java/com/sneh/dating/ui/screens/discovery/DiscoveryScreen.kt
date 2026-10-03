package com.sneh.dating.ui.screens.discovery

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.sneh.dating.R
import com.sneh.dating.domain.model.Profile
import kotlin.math.roundToInt

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DiscoveryScreen(
    profiles: List<Profile>,
    onLike: (Profile) -> Unit,
    onPass: (Profile) -> Unit,
    onSuperLike: (Profile) -> Unit,
    onReport: (Profile) -> Unit,
    onBlock: (Profile) -> Unit,
    modifier: Modifier = Modifier
) {
    val haptic = LocalHapticFeedback.current
    var currentIndex by remember { mutableIntStateOf(0) }
    var offsetX by remember { mutableFloatStateOf(0f) }
    var showProfileDetails by remember { mutableStateOf(false) }
    var showFilterSheet by remember { mutableStateOf(false) }

    // Filter states
    var maxDistanceKm by remember { mutableFloatStateOf(50f) }
    var selectedReligion by remember { mutableStateOf("All") }
    var selectedCaste by remember { mutableStateOf("All") }

    // Filtered list
    val filteredProfiles = remember(profiles, maxDistanceKm, selectedReligion, selectedCaste) {
        profiles.filter { profile ->
            val matchDist = profile.approximateDistanceKm <= maxDistanceKm
            val matchRel = selectedReligion == "All" || profile.religion.equals(selectedReligion, ignoreCase = true)
            val matchCaste = selectedCaste == "All" || (profile.caste?.contains(selectedCaste, ignoreCase = true) == true)
            matchDist && matchRel && matchCaste
        }
    }

    val currentProfile = filteredProfiles.getOrNull(currentIndex)

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "ਸਨੇਹ",
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 24.sp
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Sneh",
                            color = MaterialTheme.colorScheme.onSurface,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 20.sp
                        )
                    }
                },
                actions = {
                    // Matchmaking Filter Action
                    IconButton(onClick = { showFilterSheet = true }) {
                        Badge(
                            containerColor = MaterialTheme.colorScheme.primary,
                            contentColor = MaterialTheme.colorScheme.onPrimary
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.Tune,
                                contentDescription = "Preferences & Filters",
                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Box(
            modifier = modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp, vertical = 8.dp),
            contentAlignment = Alignment.Center
        ) {
            if (currentProfile != null) {
                // Discovery Profile Card with Swipe Physics
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .fillMaxHeight(0.85f)
                        .offset { IntOffset(offsetX.roundToInt(), 0) }
                        .pointerInput(currentProfile.id) {
                            detectDragGestures(
                                onDragEnd = {
                                    if (offsetX > 280f) {
                                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                        onLike(currentProfile)
                                        currentIndex++
                                    } else if (offsetX < -280f) {
                                        haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                        onPass(currentProfile)
                                        currentIndex++
                                    }
                                    offsetX = 0f
                                }
                            ) { change, dragAmount ->
                                change.consume()
                                offsetX += dragAmount.x
                            }
                        },
                    shape = RoundedCornerShape(28.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
                ) {
                    Box(modifier = Modifier.fillMaxSize()) {
                        // High-res profile image
                        AsyncImage(
                            model = currentProfile.photoUrls.firstOrNull(),
                            contentDescription = "Profile Photo of ${currentProfile.displayName}",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )

                        // Gradient protection overlay
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(
                                    Brush.verticalGradient(
                                        colors = listOf(
                                            Color.Transparent,
                                            Color.Black.copy(alpha = 0.3f),
                                            Color.Black.copy(alpha = 0.88f)
                                        ),
                                        startY = 300f
                                    )
                                )
                        )

                        // Top Safety & Report Action
                        IconButton(
                            onClick = { onReport(currentProfile) },
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .padding(12.dp)
                                .background(Color.Black.copy(alpha = 0.4f), CircleShape)
                        ) {
                            Icon(
                                imageVector = Icons.Default.MoreVert,
                                contentDescription = "Report or Block",
                                tint = Color.White
                            )
                        }

                        // Bottom Profile Bio & Info
                        Column(
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .padding(20.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "${currentProfile.displayName}, ${currentProfile.age}",
                                    color = Color.White,
                                    fontSize = 26.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                if (currentProfile.isVerified) {
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Icon(
                                        imageVector = Icons.Filled.Verified,
                                        contentDescription = stringResource(R.string.verified_member),
                                        tint = Color(0xFF38BDF8),
                                        modifier = Modifier.size(22.dp)
                                    )
                                }
                            }

                            // Age + DOB & Optional Matchmaking Badges
                            Row(
                                modifier = Modifier.padding(top = 4.dp),
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                currentProfile.religion?.let {
                                    SuggestionChip(
                                        onClick = {},
                                        label = { Text(it, fontSize = 11.sp, color = Color(0xFFFDE68A)) }
                                    )
                                }
                                currentProfile.caste?.let {
                                    SuggestionChip(
                                        onClick = {},
                                        label = { Text(it, fontSize = 11.sp, color = Color(0xFFFECDD3)) }
                                    )
                                }
                            }

                            // Approximate location
                            if (currentProfile.showApproximateDistance) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.padding(top = 4.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Outlined.LocationOn,
                                        contentDescription = null,
                                        tint = Color(0xFFCBD5E1),
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "${currentProfile.approximateArea}, ${currentProfile.city} • ${stringResource(R.string.approx_distance, currentProfile.approximateDistanceKm)}",
                                        color = Color(0xFFCBD5E1),
                                        fontSize = 13.sp
                                    )
                                }
                            }
                        }
                    }
                }

                // Interactive Bottom Action Row
                Row(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 12.dp)
                        .fillMaxWidth(0.75f),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    FilledIconButton(
                        onClick = {
                            onPass(currentProfile)
                            currentIndex++
                        },
                        modifier = Modifier.size(56.dp),
                        colors = IconButtonDefaults.filledIconButtonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Icon(Icons.Default.Close, contentDescription = "Pass", tint = Color(0xFFEF4444), modifier = Modifier.size(28.dp))
                    }

                    FilledIconButton(
                        onClick = {
                            onSuperLike(currentProfile)
                            currentIndex++
                        },
                        modifier = Modifier.size(48.dp),
                        colors = IconButtonDefaults.filledIconButtonColors(containerColor = Color(0xFF0284C7))
                    ) {
                        Icon(Icons.Default.Star, contentDescription = "Super Like", tint = Color.White, modifier = Modifier.size(24.dp))
                    }

                    FilledIconButton(
                        onClick = {
                            onLike(currentProfile)
                            currentIndex++
                        },
                        modifier = Modifier.size(56.dp),
                        colors = IconButtonDefaults.filledIconButtonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        Icon(Icons.Default.Favorite, contentDescription = "Like", tint = Color.White, modifier = Modifier.size(28.dp))
                    }
                }
            } else {
                // Empty state
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                    modifier = Modifier.padding(24.dp)
                ) {
                    Icon(Icons.Outlined.Tune, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(64.dp))
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("No Profiles Matching Filters", fontWeight = FontWeight.Bold, fontSize = 20.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Try expanding your distance range or resetting religion and caste filters.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(onClick = {
                        maxDistanceKm = 50f
                        selectedReligion = "All"
                        selectedCaste = "All"
                        currentIndex = 0
                    }) {
                        Text("Reset Filters")
                    }
                }
            }
        }
    }

    // Material 3 ModalBottomSheet for Filter Drawer
    if (showFilterSheet) {
        ModalBottomSheet(
            onDismissRequest = { showFilterSheet = false }
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "Discovery Matchmaking Filters",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )

                // Distance Slider
                Column {
                    Text(
                        text = "Maximum Distance: ${maxDistanceKm.roundToInt()} km",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Slider(
                        value = maxDistanceKm,
                        onValueChange = { maxDistanceKm = it },
                        valueRange = 5f..100f,
                        steps = 19
                    )
                }

                // Religion Filter Chips
                Column {
                    Text("Religion Preference", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.padding(top = 8.dp)
                    ) {
                        listOf("All", "Sikh", "Hindu", "Muslim").forEach { rel ->
                            FilterChip(
                                selected = selectedReligion == rel,
                                onClick = { selectedReligion = rel },
                                label = { Text(rel) }
                            )
                        }
                    }
                }

                // Apply button
                Button(
                    onClick = {
                        showFilterSheet = false
                        currentIndex = 0
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Apply Filters (${filteredProfiles.size} Matches)")
                }
            }
        }
    }
}
