import React, { useState } from 'react';
import { AppScreen, Language, MatchProfile, UserProfile, SafetyReportSubmission, AppTheme, GovtIdVerification } from './types/dating';
import { initialCurrentUser, sampleDiscoveryProfiles } from './constants/initialData';
import { AndroidDeviceFrame } from './components/AndroidDeviceFrame';
import { BottomNavBar } from './components/BottomNavBar';
import { CodeInspectorDrawer } from './components/CodeInspectorDrawer';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { ReportModal } from './components/ReportModal';
import { DownloadApkModal } from './components/DownloadApkModal';

// Screens
import { OnboardingView } from './components/screens/OnboardingView';
import { AgeGateView } from './components/screens/AgeGateView';
import { AuthView } from './components/screens/AuthView';
import { ProfileBuilderView } from './components/screens/ProfileBuilderView';
import { DiscoveryView } from './components/screens/DiscoveryView';
import { MatchesListView } from './components/screens/MatchesListView';
import { ChatView } from './components/screens/ChatView';
import { SafetyCenterView } from './components/screens/SafetyCenterView';
import { PrivacyDashboardView } from './components/screens/PrivacyDashboardView';
import { SettingsView } from './components/screens/SettingsView';
import { PremiumView } from './components/screens/PremiumView';
import { GovtVerificationView } from './components/screens/GovtVerificationView';
import { OwnerMonetisationView } from './components/screens/OwnerMonetisationView';

export function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('discovery');
  const [language, setLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('royal_gulab');
  const [isCodeInspectorOpen, setIsCodeInspectorOpen] = useState<boolean>(false);
  const [isDownloadApkOpen, setIsDownloadApkOpen] = useState<boolean>(false);

  // User State
  const [userProfile, setUserProfile] = useState<UserProfile>(initialCurrentUser);
  const [discoveryProfiles, setDiscoveryProfiles] = useState<MatchProfile[]>(sampleDiscoveryProfiles);
  const [matches, setMatches] = useState<MatchProfile[]>(sampleDiscoveryProfiles.slice(0, 3));
  const [selectedChatMatch, setSelectedChatMatch] = useState<MatchProfile | null>(sampleDiscoveryProfiles[0]);

  // Modals
  const [celebrationMatch, setCelebrationMatch] = useState<MatchProfile | null>(null);
  const [reportTargetProfile, setReportTargetProfile] = useState<MatchProfile | null>(null);

  // Discovery Action Handlers
  const handleLike = (profile: MatchProfile) => {
    if (profile.id === 'usr_disc_01' || profile.id === 'usr_disc_02') {
      setCelebrationMatch(profile);
      if (!matches.some((m) => m.id === profile.id)) {
        setMatches((prev) => [profile, ...prev]);
      }
    }
  };

  const handlePass = (profile: MatchProfile) => {
    // Filtered out in UI
  };

  const handleSuperLike = (profile: MatchProfile) => {
    setCelebrationMatch(profile);
    if (!matches.some((m) => m.id === profile.id)) {
      setMatches((prev) => [profile, ...prev]);
    }
  };

  const handleStartChatFromMatch = (icebreaker?: string) => {
    if (celebrationMatch) {
      setSelectedChatMatch(celebrationMatch);
      setActiveScreen('chat');
    }
    setCelebrationMatch(null);
  };

  const handleReportAndBlock = (report: SafetyReportSubmission, blockAlso: boolean) => {
    if (reportTargetProfile) {
      if (blockAlso) {
        setDiscoveryProfiles((prev) => prev.filter((p) => p.id !== reportTargetProfile.id));
        setMatches((prev) => prev.filter((p) => p.id !== reportTargetProfile.id));
        if (selectedChatMatch?.id === reportTargetProfile.id) {
          setSelectedChatMatch(null);
          setActiveScreen('matches');
        }
      }
    }
  };

  const handleDeleteAccountConfirmed = () => {
    setUserProfile(initialCurrentUser);
    setMatches([]);
    setActiveScreen('onboarding');
  };

  const handleVerificationComplete = (verification: GovtIdVerification) => {
    setUserProfile((prev) => ({
      ...prev,
      isVerified: true,
      govtVerification: verification
    }));
    setActiveScreen('discovery');
  };

  const shouldShowBottomNav = [
    'discovery',
    'matches',
    'safety',
    'privacy',
    'settings'
  ].includes(activeScreen);

  return (
    <div className="min-h-screen bg-[#07050a] text-slate-100 flex items-center justify-center relative overflow-hidden font-sans-main">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Pixel 9 Pro Device Simulator */}
      <AndroidDeviceFrame
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'en' ? 'pa' : 'en'))}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        currentTheme={currentTheme}
        onOpenCodeInspector={() => setIsCodeInspectorOpen(true)}
        onOpenDownloadApk={() => setIsDownloadApkOpen(true)}
      >
        {/* Screen Routing */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {activeScreen === 'onboarding' && (
            <OnboardingView
              language={language}
              onGetStarted={() => setActiveScreen('age_gate')}
              onSignIn={() => setActiveScreen('auth')}
            />
          )}

          {activeScreen === 'age_gate' && (
            <AgeGateView
              language={language}
              onVerified={(age, dob) => {
                setUserProfile((prev) => ({ ...prev, age, birthDate: dob }));
                setActiveScreen('auth');
              }}
              onBack={() => setActiveScreen('onboarding')}
            />
          )}

          {activeScreen === 'auth' && (
            <AuthView
              language={language}
              onAuthenticated={(phone) => {
                setActiveScreen('profile_builder');
              }}
              onBack={() => setActiveScreen('age_gate')}
            />
          )}

          {activeScreen === 'profile_builder' && (
            <ProfileBuilderView
              initialProfile={userProfile}
              language={language}
              onSaveProfile={(updated) => {
                setUserProfile(updated);
                setActiveScreen('discovery');
              }}
              onNavigateToVerification={() => setActiveScreen('verification')}
            />
          )}

          {activeScreen === 'discovery' && (
            <DiscoveryView
              profiles={discoveryProfiles}
              language={language}
              onLike={handleLike}
              onPass={handlePass}
              onSuperLike={handleSuperLike}
              onOpenReport={(p) => setReportTargetProfile(p)}
              onResetDeck={() => setDiscoveryProfiles(sampleDiscoveryProfiles)}
            />
          )}

          {activeScreen === 'matches' && (
            <MatchesListView
              matches={matches}
              language={language}
              onSelectMatch={(m) => {
                setSelectedChatMatch(m);
                setActiveScreen('chat');
              }}
            />
          )}

          {activeScreen === 'chat' && selectedChatMatch && (
            <ChatView
              match={selectedChatMatch}
              language={language}
              onBack={() => setActiveScreen('matches')}
              onOpenReport={(p) => setReportTargetProfile(p)}
            />
          )}

          {activeScreen === 'safety' && (
            <SafetyCenterView
              language={language}
              onOpenReportGeneral={() => {
                if (discoveryProfiles[0]) setReportTargetProfile(discoveryProfiles[0]);
              }}
            />
          )}

          {activeScreen === 'privacy' && (
            <PrivacyDashboardView
              userProfile={userProfile}
              language={language}
              onUpdatePrivacySettings={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
              onDeleteAccountConfirmed={handleDeleteAccountConfirmed}
            />
          )}

          {activeScreen === 'settings' && (
            <SettingsView
              userProfile={userProfile}
              language={language}
              onToggleLanguage={() => setLanguage((prev) => (prev === 'en' ? 'pa' : 'en'))}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
              currentTheme={currentTheme}
              onChangeTheme={setCurrentTheme}
              onNavigateToPrivacy={() => setActiveScreen('privacy')}
              onNavigateToSafety={() => setActiveScreen('safety')}
              onNavigateToPremium={() => setActiveScreen('premium')}
              onNavigateToVerification={() => setActiveScreen('verification')}
              onNavigateToOwnerMonetisation={() => setActiveScreen('owner_monetisation')}
              onLogout={() => setActiveScreen('onboarding')}
            />
          )}

          {activeScreen === 'premium' && (
            <PremiumView
              language={language}
              onBack={() => setActiveScreen('discovery')}
            />
          )}

          {activeScreen === 'verification' && (
            <GovtVerificationView
              language={language}
              currentVerification={userProfile.govtVerification}
              onVerificationComplete={handleVerificationComplete}
              onBack={() => setActiveScreen('settings')}
            />
          )}

          {activeScreen === 'owner_monetisation' && (
            <OwnerMonetisationView
              onBack={() => setActiveScreen('settings')}
            />
          )}
        </div>

        {/* Bottom Navigation Bar */}
        {shouldShowBottomNav && (
          <BottomNavBar
            activeScreen={activeScreen}
            onNavigate={setActiveScreen}
            language={language}
            unreadCount={matches.reduce((acc, m) => acc + m.unreadCount, 0)}
          />
        )}

        {/* Mutual Match Celebration Modal */}
        {celebrationMatch && (
          <MatchCelebrationModal
            matchedProfile={celebrationMatch}
            myPhoto={userProfile.photos[0]}
            language={language}
            onSendMessage={handleStartChatFromMatch}
            onKeepDiscovering={() => setCelebrationMatch(null)}
          />
        )}

        {/* Reporting and Incident Redressal Modal */}
        {reportTargetProfile && (
          <ReportModal
            targetProfile={reportTargetProfile}
            isOpen={!!reportTargetProfile}
            onClose={() => setReportTargetProfile(null)}
            onSubmitReport={handleReportAndBlock}
          />
        )}

        {/* Download & Install Ready APK Modal */}
        <DownloadApkModal
          isOpen={isDownloadApkOpen}
          onClose={() => setIsDownloadApkOpen(false)}
        />
      </AndroidDeviceFrame>

      {/* Real Kotlin Jetpack Compose Code & Architecture Explorer */}
      <CodeInspectorDrawer
        activeScreen={activeScreen}
        isOpen={isCodeInspectorOpen}
        onToggle={() => setIsCodeInspectorOpen(!isCodeInspectorOpen)}
      />
    </div>
  );
}

export default App;
