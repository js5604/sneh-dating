package com.sneh.dating.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sneh.dating.domain.model.*
import com.sneh.dating.domain.repository.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DiscoveryViewModel @Inject constructor(
    private val discoveryRepository: DiscoveryRepository,
    private val safetyRepository: SafetyRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<DiscoveryUiState>(DiscoveryUiState.Loading)
    val uiState: StateFlow<DiscoveryUiState> = _uiState.asStateFlow()

    init {
        loadDiscoveryFeed()
    }

    fun loadDiscoveryFeed() {
        viewModelScope.launch {
            discoveryRepository.getDiscoveryFeed()
                .catch { e -> _uiState.value = DiscoveryUiState.Error(e.message ?: "Failed to load profiles") }
                .collect { profiles ->
                    _uiState.value = DiscoveryUiState.Success(profiles)
                }
        }
    }

    fun onLike(profile: Profile, onMutualMatch: (Profile) -> Unit) {
        viewModelScope.launch {
            val result = discoveryRepository.likeProfile(profile.id)
            if (result.getOrDefault(false)) {
                onMutualMatch(profile)
            }
        }
    }

    fun onPass(profile: Profile) {
        viewModelScope.launch {
            discoveryRepository.passProfile(profile.id)
        }
    }

    fun onSuperLike(profile: Profile, onMutualMatch: (Profile) -> Unit) {
        viewModelScope.launch {
            val result = discoveryRepository.superLikeProfile(profile.id)
            if (result.getOrDefault(false)) {
                onMutualMatch(profile)
            }
        }
    }

    fun reportUser(report: SafetyReport, onComplete: () -> Unit) {
        viewModelScope.launch {
            safetyRepository.reportUser(report)
            safetyRepository.blockUser(report.reportedUserId)
            onComplete()
            loadDiscoveryFeed()
        }
    }
}

sealed interface DiscoveryUiState {
    object Loading : DiscoveryUiState
    data class Success(val profiles: List<Profile>) : DiscoveryUiState
    data class Error(val message: String) : DiscoveryUiState
}
