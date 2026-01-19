import { useState, useEffect } from 'react';

interface ScreenSize {
    width: number;
    height: number;
    isXS: boolean;
    isSM: boolean;
    isMobile: boolean;
    isTablet: boolean;
    isMD: boolean;
    isLG: boolean;
    isXL: boolean;
    is2XL: boolean;
    isDesktopSM: boolean;
    isDesktopMD: boolean;
    isDesktopLG: boolean;
    isDesktopXL: boolean;
    isDesktop2XL: boolean;
    isDesktopUltra: boolean;
    is4K: boolean;
    is5K: boolean;
    is8K: boolean;
    isLandscape: boolean;
    isPortrait: boolean;
    isTouchDevice: boolean;
    isAppleWatch: boolean;
    isSmartphone: boolean;
    isSmartphoneSmall: boolean;
    isSmartphoneMedium: boolean;
    isSmartphoneLarge: boolean;
    isTabletSmall: boolean;
    isTabletMedium: boolean;
    isTabletLarge: boolean;
}

export const useResponsive = (): ScreenSize => {
    const [screenSize, setScreenSize] = useState<ScreenSize>({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
        isXS: false,
        isSM: false,
        isMobile: false,
        isTablet: false,
        isMD: false,
        isLG: false,
        isXL: false,
        is2XL: false,
        isDesktopSM: false,
        isDesktopMD: false,
        isDesktopLG: false,
        isDesktopXL: false,
        isDesktop2XL: false,
        isDesktopUltra: false,
        is4K: false,
        is5K: false,
        is8K: false,
        isLandscape: false,
        isPortrait: false,
        isTouchDevice: false,
        isAppleWatch: false,
        isSmartphone: false,
        isSmartphoneSmall: false,
        isSmartphoneMedium: false,
        isSmartphoneLarge: false,
        isTabletSmall: false,
        isTabletMedium: false,
        isTabletLarge: false,
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isTouchDevice = () => {
                return (
                    (typeof window !== 'undefined' &&
                        ('ontouchstart' in window ||
                            (navigator.maxTouchPoints !== undefined &&
                                navigator.maxTouchPoints > 0))) ||
                    false
                );
            };

            setScreenSize({
                width,
                height,
                // Standard breakpoints
                isXS: width < 375,
                isSM: width >= 375 && width < 480,
                isMobile: width < 640,
                isTablet: width >= 640 && width < 1024,
                isMD: width >= 768,
                isLG: width >= 1024,
                isXL: width >= 1280,
                is2XL: width >= 1536,
                isDesktopSM: width >= 1280,
                isDesktopMD: width >= 1366,
                isDesktopLG: width >= 1536,
                isDesktopXL: width >= 1920,
                isDesktop2XL: width >= 2048,
                isDesktopUltra: width >= 2560,
                is4K: width >= 3840,
                is5K: width >= 5120,
                is8K: width >= 7680,
                // Orientation
                isLandscape: width > height,
                isPortrait: width <= height,
                // Device type detection
                isTouchDevice: isTouchDevice(),
                isAppleWatch: width <= 320 && height <= 320,
                isSmartphone: width < 768,
                isSmartphoneSmall: width >= 320 && width < 375,
                isSmartphoneMedium: width >= 375 && width < 568,
                isSmartphoneLarge: width >= 568 && width < 640,
                isTabletSmall: width >= 600 && width < 820,
                isTabletMedium: width >= 820 && width < 1024,
                isTabletLarge: width >= 1024 && width < 1280,
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    return screenSize;
};

export const useIsDesktop = (): boolean => {
    const { isLG } = useResponsive();
    return isLG;
};

export const useIsMobile = (): boolean => {
    const { isMobile } = useResponsive();
    return isMobile;
};

export const useIsTouchDevice = (): boolean => {
    const { isTouchDevice } = useResponsive();
    return isTouchDevice;
};
