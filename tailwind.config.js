/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // Ultra-petits écrans (Apple Watch, appareils wearable)
        'xs': '320px',
        'xs-landscape': { 'raw': '(max-height: 500px)' },

        // Petits smartphones
        'sm': '375px',
        'sm-landscape': { 'raw': '(max-height: 600px) and (min-width: 600px)' },

        // Smartphones standards (480px - 640px)
        'mobile': '480px',
        'mobile-lg': '568px',

        // Tablettes et petit écran (640px - 800px)
        'md': '768px',
        'tablet-sm': '600px',

        // Tablettes moyennes et paysage (800px - 1024px)
        'lg': '1024px',
        'tablet-md': '820px',
        'tablet-landscape': { 'raw': '(orientation: landscape) and (min-height: 400px)' },

        // Tablettes grandes et petit desktop (1024px - 1280px)
        'xl': '1280px',
        'tablet-lg': '1024px',

        // Desktop mini à moyen (1280px - 1536px)
        '2xl': '1536px',
        'desktop-sm': '1280px',
        'desktop-md': '1366px',

        // Desktop grand (1536px - 1920px)
        'desktop-lg': '1536px',

        // Très grand écran (1920px - 2560px)
        'desktop-xl': '1920px',
        'desktop-2xl': '2048px',

        // Écran géant (2560px+)
        'desktop-ultra': '2560px',
        '4k': '3840px',

        // Écrans ultra-larges (5120px+)
        '5k': '5120px',
        '8k': '7680px',
      },
      spacing: {
        // Ajustements de spacing pour petits écrans
        'xs-gap': 'clamp(0.5rem, 1.5vw, 1rem)',
        'sm-gap': 'clamp(0.75rem, 2vw, 1.5rem)',
        'md-gap': 'clamp(1rem, 2.5vw, 2rem)',
        'lg-gap': 'clamp(1.5rem, 3vw, 3rem)',
      },
      fontSize: {
        // Tailles de texte fluides
        'xs-fluid': 'clamp(0.65rem, 1.5vw, 0.875rem)',
        'sm-fluid': 'clamp(0.75rem, 1.8vw, 0.875rem)',
        'base-fluid': 'clamp(0.875rem, 2vw, 1rem)',
        'lg-fluid': 'clamp(1rem, 2.5vw, 1.125rem)',
        'xl-fluid': 'clamp(1.125rem, 3vw, 1.25rem)',
        '2xl-fluid': 'clamp(1.25rem, 3.5vw, 1.5rem)',
        '3xl-fluid': 'clamp(1.5rem, 4vw, 1.875rem)',
        '4xl-fluid': 'clamp(1.875rem, 5vw, 2.25rem)',
      },
      maxWidth: {
        'screen-xs': '320px',
        'screen-sm': '375px',
        'screen-mobile': '480px',
        'screen-tablet': '820px',
      },
    },
  },
  plugins: [],
};
