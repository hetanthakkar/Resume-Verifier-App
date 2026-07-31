export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceSecondary: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Border colors
  border: string;
  borderSecondary: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Gradient colors
  gradients: {
    primary: string[];
    secondary: string[];
    success: string[];
    warning: string[];
    error: string[];
    info: string[];
    purple: string[];
    pink: string[];
    blue: string[];
    teal: string[];
  };
  
  // Component specific colors
  card: string;
  input: string;
  button: string;
  buttonSecondary: string;
  tabBar: string;
  statusBar: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: {
      fontSize: number;
      fontWeight: string;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
    };
    h3: {
      fontSize: number;
      fontWeight: string;
    };
    body: {
      fontSize: number;
      fontWeight: string;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
    };
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    primaryLight: '#4DA3FF',
    primaryDark: '#0056CC',
    
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundTertiary: '#F0F0F3',
    surface: '#FFFFFF',
    surfaceSecondary: '#F7FAFC',
    
    text: '#1E1E1E',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textInverse: '#FFFFFF',
    
    border: '#E0E0E0',
    borderSecondary: '#E2E8F0',
    
    success: '#28A745',
    warning: '#FF9800',
    error: '#FF4757',
    info: '#45AAF2',
    
    gradients: {
      primary: ['#007AFF', '#4DA3FF'],
      secondary: ['#6C757D', '#495057'],
      success: ['#28A745', '#20C997'],
      warning: ['#FF9800', '#FFC107'],
      error: ['#FF4757', '#FF6B81'],
      info: ['#45AAF2', '#2D98DA'],
      purple: ['#A29BFE', '#6C5CE7'],
      pink: ['#FF9FF3', '#F368E0'],
      blue: ['#45AAF2', '#2D98DA'],
      teal: ['#4ECDC4', '#45B7A8'],
    },
    
    card: '#FFFFFF',
    input: '#F7FAFC',
    button: '#007AFF',
    buttonSecondary: '#6C757D',
    tabBar: '#FFFFFF',
    statusBar: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
    },
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#0A84FF',
    primaryLight: '#5E9EFF',
    primaryDark: '#0056CC',
    
    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    backgroundTertiary: '#2C2C2E',
    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',
    
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#EBEBF599',
    textInverse: '#000000',
    
    border: '#38383A',
    borderSecondary: '#48484A',
    
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#64D2FF',
    
    gradients: {
      primary: ['#0A84FF', '#5E9EFF'],
      secondary: ['#8E8E93', '#636366'],
      success: ['#30D158', '#32D74B'],
      warning: ['#FF9F0A', '#FFB340'],
      error: ['#FF453A', '#FF6961'],
      info: ['#64D2FF', '#5AC8FA'],
      purple: ['#BF5AF2', '#AF52DE'],
      pink: ['#FF2D92', '#FF375F'],
      blue: ['#64D2FF', '#5AC8FA'],
      teal: ['#40C8E0', '#64D2FF'],
    },
    
    card: '#1C1C1E',
    input: '#2C2C2E',
    button: '#0A84FF',
    buttonSecondary: '#8E8E93',
    tabBar: '#1C1C1E',
    statusBar: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
    },
  },
}; 