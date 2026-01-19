/**
 * Configuration de meta tags pour la responsivité
 * À ajouter dans le fichier index.html
 */

export const metaTags = [
    {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=5.0, user-scalable=yes'
    },
    {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
    },
    {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent'
    },
    {
        name: 'apple-mobile-web-app-title',
        content: 'Gestion RH'
    },
    {
        name: 'theme-color',
        content: '#1f2937'
    },
    {
        name: 'description',
        content: 'Plateforme de gestion RH ultra-responsive pour tous les appareils'
    },
    {
        name: 'format-detection',
        content: 'telephone=no'
    },
    {
        name: 'x-ua-compatible',
        content: 'IE=edge'
    }
];

/**
 * Optimisations de performance pour différents appareils
 */
export const deviceOptimizations = {
    // Apple Watch
    appleWatch: {
        reducedMotion: true,
        largeControls: true,
        minimizeData: true,
        simplifyUI: true,
    },

    // Smartphone
    smartphone: {
        lazyLoadImages: true,
        reducedAnimations: false,
        touchOptimized: true,
        largeControls: false,
    },

    // Tablette
    tablet: {
        lazyLoadImages: false,
        reducedAnimations: false,
        touchOptimized: true,
        largeControls: false,
    },

    // Desktop
    desktop: {
        lazyLoadImages: false,
        reducedAnimations: false,
        touchOptimized: false,
        largeControls: false,
    },

    // Écran géant (2560px+)
    largeScreen: {
        lazyLoadImages: false,
        reducedAnimations: false,
        touchOptimized: false,
        largeControls: true,
        maximizeSpacing: true,
    },
};

/**
 * Tailles de zones tactiles recommandées pour différents appareils
 */
export const touchTargetSizes = {
    small: 40,        // Apple Watch: 40x40px minimum
    standard: 48,     // Mobile/Tablet: 48x48px (Material Design)
    large: 56,        // Grand écran: 56x56px
    xlarge: 64,       // Écran géant: 64x64px
};

/**
 * Résolutions recommandées pour les images
 */
export const imageBreakpoints = {
    xs: { width: 320, srcset: '1x' },
    sm: { width: 375, srcset: '1x' },
    md: { width: 768, srcset: '1x, 2x' },
    lg: { width: 1024, srcset: '1x, 2x' },
    xl: { width: 1280, srcset: '1x, 2x' },
    '2xl': { width: 1536, srcset: '1x, 2x, 3x' },
    desktop4k: { width: 2560, srcset: '2x, 3x' },
    '4k': { width: 3840, srcset: '2x, 3x, 4x' },
};

/**
 * Tailles de police recommandées pour lisibilité
 */
export const fontSizeAccessibility = {
    minimum: 12,      // Minimum absolu
    body: 14,         // Corps du texte
    bodyTablet: 16,   // Tablette
    bodyDesktop: 16,  // Desktop
    desktopLarge: 18, // Écran géant
};

/**
 * Espacements recommandés pour différentes densités
 */
export const densitySpacing = {
    compact: 0.75,    // Apple Watch, petit écran
    standard: 1,      // Défaut
    comfortable: 1.25, // Tablette
    spacious: 1.5,    // Desktop large
    expansive: 2,     // Écran géant
};

/**
 * Nombre de colonnes recommandées par appareil
 */
export const gridColumns = {
    appleWatch: 1,
    smartphone: 1,
    smartphoneSmall: 1,
    smartphoneLarge: 2,
    tablet: 2,
    tabletLandscape: 3,
    desktopSmall: 3,
    desktopMedium: 4,
    desktopLarge: 5,
    screenGiant: 6,
    '4k': 8,
};

/**
 * Hauteur de navigation recommandée
 */
export const navHeight = {
    appleWatch: 40,
    smartphone: 56,
    tablet: 64,
    desktop: 64,
    screenGiant: 80,
};

/**
 * Suggestions d'orientation pour chaque appareil
 */
export const orientationSupport = {
    smartphone: ['portrait', 'landscape'],
    tablet: ['portrait', 'landscape'],
    desktop: ['landscape'],
    appleWatch: ['portrait'],
};
