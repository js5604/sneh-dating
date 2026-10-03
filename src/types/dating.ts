export type Language = 'en' | 'pa';

export type AppTheme = 
  | 'royal_gulab'     // Royal Gulab Ruby & Midnight Velvet (Default)
  | 'kesari_gold'     // Kesari Saffron & Festive Gold
  | 'phulkari'        // Punjabi Phulkari Festival (Vibrant Magenta & Gold)
  | 'nilgiri'         // Nilgiri Indigo & Star Silver
  | 'ivory_silk';     // Warm Ivory Silk & Rose Gold

export type AppScreen = 
  | 'onboarding'
  | 'age_gate'
  | 'auth'
  | 'profile_builder'
  | 'discovery'
  | 'matches'
  | 'chat'
  | 'safety'
  | 'privacy'
  | 'settings'
  | 'premium'
  | 'verification'       // Online Govt ID Verification (Aadhaar, PAN, Passport)
  | 'owner_monetisation'; // Owner-Only Monetisation Suite

export interface GovtIdVerification {
  isVerified: boolean;
  docType: 'Aadhaar Card' | 'PAN Card' | 'Passport' | 'Voter ID';
  maskedNumber: string;
  verifiedAt: string;
  badgeLevel: 'Govt Approved' | 'DigiLocker Verified';
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  birthDate: string; // Age + DOB
  gender: string;
  city: string;
  area: string;
  approxDistanceKm: number;
  profession: string;
  education: string;
  bio: string;
  interests: string[];
  languages: string[];
  relationshipGoal: string;
  
  // Optional Indian Matchmaking Details
  religion?: 'Sikh' | 'Hindu' | 'Muslim' | 'Christian' | 'Jain' | 'Buddhist' | 'Spiritual / Other';
  caste?: string; // Jatt, Khatri, Arora, Brahmin, Rajput, Ramgarhia, Saini, Kamboj, Ahluwalia, Aggarwal / Bania, Gursikh / Mazhabi, Ravidasia, Other / Open
  maritalStatus?: 'Never Married' | 'Divorced' | 'Awaiting Divorce' | 'Widowed';
  showOptionalDetails: boolean; // Privacy control

  // Govt ID Online Verification Status
  govtVerification?: GovtIdVerification;

  lifestyle: {
    diet: string;
    smoking: string;
    drinking: string;
    communityPref?: string;
  };
  photos: string[];
  isVerified: boolean;
  showApproxDistance: boolean;
  incognito: boolean;
  readReceipts: boolean;
}

export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  birthDate?: string; // Age + DOB
  photo: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  verified: boolean;
  city: string;
  area: string;
  approxDistanceKm: number;
  bio: string;
  profession: string;
  interests: string[];
  
  // Optional Indian Matchmaking Details
  religion?: 'Sikh' | 'Hindu' | 'Muslim' | 'Christian' | 'Jain' | 'Buddhist' | 'Spiritual / Other';
  caste?: string;
  maritalStatus?: 'Never Married' | 'Divorced' | 'Awaiting Divorce' | 'Widowed';
  govtVerification?: GovtIdVerification;

  lifestyle: {
    diet: string;
    smoking: string;
    drinking: string;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  containsScamAlert?: boolean;
  type?: 'text' | 'image' | 'video' | 'location';
  mediaUrl?: string;
  locationData?: {
    placeName: string;
    approxArea: string;
    durationMins: number;
    expiresAt: string;
  };
}

export interface SafetyReportSubmission {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  category: string;
  description: string;
  timestamp: string;
  status: 'Received' | 'In Review' | 'Resolved';
}

export interface OwnerMonetisationConfig {
  ownerEmail: string; // Jatindersingh5604@gmail.com
  enableGooglePlayBilling: boolean;
  enableRewardedAds: boolean;     // Watch video ad for 3 Super Likes
  enableInterstitialAds: boolean;  // Show after 10 swipes
  enableDiscoveryBanners: boolean; // Native ad in discovery deck
  enableProfileBoost: boolean;     // ₹149 for 30m boost
  plans: {
    oneMonthPrice: number;
    threeMonthsPrice: number;
    twelveMonthsPrice: number;
  };
  metrics: {
    totalRevenueInr: number;
    activeSubscribers: number;
    monthlyRecurringRevenue: number;
    adImpressionsToday: number;
    adRevenueTodayInr: number;
  };
}

export interface KotlinCodeSnippet {
  fileName: string;
  filePath: string;
  language: string;
  code: string;
  explanation: string;
}
