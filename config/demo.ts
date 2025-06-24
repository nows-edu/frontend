// Demo/Fake Mode Configuration
export const DEMO_CONFIG = {
  // Enable fake mode for demo purposes
  FAKE_MODE: process.env.EXPO_PUBLIC_FAKE_MODE === 'true' || false,
  
  // Demo user for testing
  DEMO_USER: {
    id: 1,
    name: 'Demo User',
    username: 'demo_user',
    email: 'demo@example.com',
    profileImage: 'https://i.pravatar.cc/150?u=demo',
  },
  
  // Demo settings
  SETTINGS: {
    // Faster response times in demo mode
    API_DELAY: 300,
    
    // Show demo banner
    SHOW_DEMO_BANNER: true,
    
    // Demo data refresh interval (in ms)
    DATA_REFRESH_INTERVAL: 30000,
  },
  
  // Demo content preferences
  CONTENT: {
    // Percentage of video content vs images
    VIDEO_RATIO: 0.3,
    
    // Max items per page
    PAGE_SIZE: 10,
    
    // Total items available in demo
    TOTAL_ITEMS: 50,
  }
};

// Helper functions for demo mode
export const isDemoMode = () => DEMO_CONFIG.FAKE_MODE;

export const getDemoUser = () => DEMO_CONFIG.DEMO_USER;

export const showDemoBanner = () => DEMO_CONFIG.SETTINGS.SHOW_DEMO_BANNER && isDemoMode();

// Export demo status for easy checking
export const DEMO_STATUS = {
  enabled: isDemoMode(),
  user: getDemoUser(),
  showBanner: showDemoBanner(),
};
