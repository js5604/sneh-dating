import { MatchProfile, UserProfile, OwnerMonetisationConfig } from '../types/dating';

export const initialCurrentUser: UserProfile = {
  id: 'usr_me_01',
  name: 'Aarav Malhotra',
  age: 27,
  birthDate: '1999-04-12', // 12 April 1999
  gender: 'Man',
  city: 'Chandigarh',
  area: 'Sector 8',
  approxDistanceKm: 0,
  profession: 'Product Designer',
  education: 'NID Ahmedabad',
  bio: 'Designing with heart, listening to Nusrat Fateh Ali Khan on repeat, and always up for adrak wali chai and late-night philosophical conversations.',
  interests: ['Chai Lover ☕', 'Sufi Music 🎵', 'Heritage Architecture 🏛️', 'Cycling 🚴', 'Punjabi Literature 📖'],
  languages: ['English', 'Punjabi', 'Hindi'],
  relationshipGoal: 'Long-term relationship',
  
  // Optional Indian Matchmaking Details
  religion: 'Sikh',
  caste: 'Khatri',
  maritalStatus: 'Never Married',
  showOptionalDetails: true,

  // Govt ID Online Verification Status
  govtVerification: {
    isVerified: true,
    docType: 'Aadhaar Card',
    maskedNumber: 'XXXX-XXXX-9281',
    verifiedAt: '2026-03-15',
    badgeLevel: 'DigiLocker Verified'
  },

  lifestyle: {
    diet: 'Vegetarian',
    smoking: 'Never',
    drinking: 'Occasionally',
    communityPref: 'Culturally Rooted'
  },
  photos: [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'
  ],
  isVerified: true,
  showApproxDistance: true,
  incognito: false,
  readReceipts: true
};

export const sampleDiscoveryProfiles: MatchProfile[] = [
  {
    id: 'usr_disc_01',
    name: 'Meher Kaur',
    age: 26,
    birthDate: '1998-08-14', // 14 Aug 1998
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    lastMessage: 'Let\'s definitely visit the museum exhibition this Saturday!',
    timestamp: '10:45 AM',
    unreadCount: 1,
    verified: true,
    city: 'Chandigarh',
    area: 'Sector 17',
    approxDistanceKm: 3,
    bio: 'Architect passionate about sustainable urban spaces, acoustic guitar, and finding the quietest bookstores in the city.',
    profession: 'Urban Architect',
    interests: ['Acoustic Music 🎸', 'Architecture 📐', 'Filter Coffee ☕', 'Poetry ✍️', 'Badminton 🏸'],
    
    // Optional Details
    religion: 'Sikh',
    caste: 'Jatt (Sidhu)',
    maritalStatus: 'Never Married',
    govtVerification: {
      isVerified: true,
      docType: 'Aadhaar Card',
      maskedNumber: 'XXXX-XXXX-4412',
      verifiedAt: '2026-02-10',
      badgeLevel: 'DigiLocker Verified'
    },

    lifestyle: {
      diet: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Never'
    }
  },
  {
    id: 'usr_disc_02',
    name: 'Ananya Sharma',
    age: 25,
    birthDate: '1999-11-20', // 20 Nov 1999
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    lastMessage: 'Hey Aarav! What\'s your favorite Sufi track of all time?',
    timestamp: 'Yesterday',
    unreadCount: 0,
    verified: true,
    city: 'Delhi NCR',
    area: 'Hauz Khas',
    approxDistanceKm: 14,
    bio: 'Documentary filmmaker capturing forgotten Indian crafts. Weekend baker and proud dog mom to a golden retriever named Bruno 🐾.',
    profession: 'Creative Director',
    interests: ['Film Making 🎬', 'Golden Retrievers 🐕', 'Baking 🥐', 'Kathak Dance 💃', 'Travel ✈️'],
    
    // Optional Details
    religion: 'Hindu',
    caste: 'Brahmin',
    maritalStatus: 'Never Married',
    govtVerification: {
      isVerified: true,
      docType: 'PAN Card',
      maskedNumber: 'ABCPSXXXXK',
      verifiedAt: '2026-01-22',
      badgeLevel: 'Govt Approved'
    },

    lifestyle: {
      diet: 'Eggetarian',
      smoking: 'Never',
      drinking: 'Socially'
    }
  },
  {
    id: 'usr_disc_03',
    name: 'Simran Dhillon',
    age: 28,
    birthDate: '1996-03-08', // 8 Mar 1996
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    lastMessage: 'That sound like an awesome plan!',
    timestamp: '2d ago',
    unreadCount: 0,
    verified: true,
    city: 'Mohali',
    area: 'Phase 7',
    approxDistanceKm: 5,
    bio: 'Cardiologist in training. Believer in kindness, hearty Punjabi laughs, and the sacred ritual of Sunday brunch with family.',
    profession: 'Resident Doctor',
    interests: ['Classical Music 🎻', 'Healthcare 🩺', 'Running 🏃‍♀️', 'Gurmat Sangeet 🕊️', 'Tea Tasting 🫖'],
    
    // Optional Details
    religion: 'Sikh',
    caste: 'Jatt (Dhillon)',
    maritalStatus: 'Never Married',
    govtVerification: {
      isVerified: true,
      docType: 'Passport',
      maskedNumber: 'ZXXXX491',
      verifiedAt: '2026-03-01',
      badgeLevel: 'Govt Approved'
    },

    lifestyle: {
      diet: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Never'
    }
  },
  {
    id: 'usr_disc_04',
    name: 'Harpreet Ramgarhia',
    age: 29,
    birthDate: '1995-07-16', // 16 July 1995
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    lastMessage: 'Loved your perspective on mindful design.',
    timestamp: '3d ago',
    unreadCount: 0,
    verified: true,
    city: 'Ludhiana',
    area: 'Sarabha Nagar',
    approxDistanceKm: 42,
    bio: 'Automotive industrialist, heritage restorer, and enthusiast of fine vintage Royal Enfields. Seeking mutual understanding and lifelong companionship.',
    profession: 'Industrial Entrepreneur',
    interests: ['Vintage Bikes 🏍️', 'Classical Poetry 📜', 'Entrepreneurship 💼', 'Culinary Arts 🍳'],
    
    // Optional Details
    religion: 'Sikh',
    caste: 'Ramgarhia',
    maritalStatus: 'Divorced',
    govtVerification: {
      isVerified: true,
      docType: 'Aadhaar Card',
      maskedNumber: 'XXXX-XXXX-8910',
      verifiedAt: '2026-01-14',
      badgeLevel: 'DigiLocker Verified'
    },

    lifestyle: {
      diet: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Socially'
    }
  }
];

export const sampleIcebreakers = [
  "Hi! I loved that you're into Sufi music. What's one song that never fails to calm your mind?",
  "Hello! Adrak wali chai or South Indian filter coffee on a rainy Sunday morning?",
  "Hi there! What's the most memorable book or exhibition you explored recently?",
  "Sat Sri Akal! Your architecture projects look mesmerizing. What inspired you to choose that field?"
];

export const initialOwnerMonetisation: OwnerMonetisationConfig = {
  ownerEmail: 'Jatindersingh5604@gmail.com',
  enableGooglePlayBilling: true,
  enableRewardedAds: true,
  enableInterstitialAds: false,
  enableDiscoveryBanners: true,
  enableProfileBoost: true,
  plans: {
    oneMonthPrice: 799,
    threeMonthsPrice: 1499,
    twelveMonthsPrice: 3599
  },
  metrics: {
    totalRevenueInr: 487500,
    activeSubscribers: 614,
    monthlyRecurringRevenue: 182400,
    adImpressionsToday: 12480,
    adRevenueTodayInr: 9640
  }
};
