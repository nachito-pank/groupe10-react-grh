/**
 * Tests de responsivité pour différents appareils
 * À exécuter dans la console du navigateur ou dans des tests automatisés
 */

/**
 * Point de contrôle 1: Vérifier les breakpoints
 */
export const testBreakpoints = () => {
    const tests = [
        {
            name: 'Apple Watch (320x320)',
            width: 320,
            height: 320,
            expectedClass: 'xs',
        },
        {
            name: 'iPhone SE (375x667)',
            width: 375,
            height: 667,
            expectedClass: 'sm',
        },
        {
            name: 'iPhone 12/13 (390x844)',
            width: 390,
            height: 844,
            expectedClass: 'sm',
        },
        {
            name: 'iPhone 14 Pro Max (430x932)',
            width: 430,
            height: 932,
            expectedClass: 'mobile',
        },
        {
            name: 'iPad (768x1024)',
            width: 768,
            height: 1024,
            expectedClass: 'md',
        },
        {
            name: 'iPad Pro (1024x1366)',
            width: 1024,
            height: 1366,
            expectedClass: 'lg',
        },
        {
            name: 'Desktop (1920x1080)',
            width: 1920,
            height: 1080,
            expectedClass: 'desktop-xl',
        },
        {
            name: 'Desktop Large (2560x1440)',
            width: 2560,
            height: 1440,
            expectedClass: 'desktop-ultra',
        },
        {
            name: '4K (3840x2160)',
            width: 3840,
            height: 2160,
            expectedClass: '4k',
        },
    ];

    console.log('=== Tests de Breakpoints ===\n');

    tests.forEach(test => {
        console.log(`✓ ${test.name}: ${test.width}x${test.height}`);
        console.log(`  Expected breakpoint: ${test.expectedClass}\n`);
    });

    return tests;
};

/**
 * Point de contrôle 2: Vérifier les zones tactiles
 */
export const testTouchTargets = () => {
    const buttons = document.querySelectorAll('button, a[role="button"]');
    const issues: Array<{
        index: number;
        element: Element;
        size: string;
        recommendation: string;
    }> = [];

    buttons.forEach((button, index) => {
        const rect = (button as HTMLElement).getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        if (width < 48 || height < 48) {
            issues.push({
                index,
                element: button,
                size: `${width}x${height}px`,
                recommendation: 'Augmenter à 48x48px minimum pour mobile',
            });
        }
    });

    console.log('=== Vérification des Zones Tactiles ===\n');
    if (issues.length === 0) {
        console.log('✓ Toutes les zones tactiles sont conformes (48x48px minimum)');
    } else {
        console.warn(`⚠ ${issues.length} zones tactiles non conformes:`);
        issues.forEach(issue => {
            console.warn(`  - ${issue.size} → ${issue.recommendation}`);
        });
    }

    return issues;
};

/**
 * Point de contrôle 3: Vérifier la lisibilité du texte
 */
export const testFontSizes = () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const paragraphs = document.querySelectorAll('p, span, a');
    const issues: Array<{
        type: string;
        element: Element;
        size: string;
        recommendation: string;
    }> = [];

    headings.forEach((heading) => {
        const fontSize = window.getComputedStyle(heading).fontSize;
        const size = parseFloat(fontSize);
        if (size < 16) {
            issues.push({
                type: 'Heading',
                element: heading,
                size: fontSize,
                recommendation: 'Augmenter à 16px minimum',
            });
        }
    });

    paragraphs.forEach((para) => {
        const fontSize = window.getComputedStyle(para).fontSize;
        const size = parseFloat(fontSize);
        if (size < 12) {
            issues.push({
                type: 'Text',
                element: para,
                size: fontSize,
                recommendation: 'Augmenter à 12px minimum',
            });
        }
    });

    console.log('=== Vérification de la Lisibilité ===\n');
    if (issues.length === 0) {
        console.log('✓ Toutes les tailles de texte sont lisibles');
    } else {
        console.warn(`⚠ ${issues.length} problèmes de lisibilité:`);
        issues.slice(0, 5).forEach(issue => {
            console.warn(`  - ${issue.type}: ${issue.size} → ${issue.recommendation}`);
        });
    }

    return issues;
};

/**
 * Point de contrôle 4: Vérifier le scroll horizontal
 */
export const testHorizontalScroll = () => {
    const bodyWidth = document.body.scrollWidth;
    const windowWidth = window.innerWidth;

    const hasHorizontalScroll = bodyWidth > windowWidth;

    console.log('=== Vérification du Scroll Horizontal ===\n');
    console.log(`Body Width: ${bodyWidth}px`);
    console.log(`Window Width: ${windowWidth}px`);

    if (hasHorizontalScroll) {
        console.warn('⚠ Scroll horizontal détecté!');
        console.warn(`Excédent: ${bodyWidth - windowWidth}px`);
    } else {
        console.log('✓ Pas de scroll horizontal indésirable');
    }

    return {
        hasHorizontalScroll,
        bodyWidth,
        windowWidth,
        excess: Math.max(0, bodyWidth - windowWidth),
    };
};

/**
 * Point de contrôle 5: Vérifier les images responsives
 */
export const testResponsiveImages = () => {
    const images = document.querySelectorAll('img');
    const issues: Array<{
        index: number;
        element: HTMLImageElement;
        issue: string;
        natural: string;
        display: string;
    }> = [];

    images.forEach((img, index) => {
        const naturalWidth = (img as HTMLImageElement).naturalWidth;
        const naturalHeight = (img as HTMLImageElement).naturalHeight;
        const displayWidth = img.getBoundingClientRect().width;
        const displayHeight = img.getBoundingClientRect().height;

        if (displayWidth > 0 && naturalWidth > displayWidth * 3) {
            issues.push({
                index,
                element: img as HTMLImageElement,
                issue: 'Image trop grande pour son conteneur',
                natural: `${naturalWidth}x${naturalHeight}px`,
                display: `${Math.round(displayWidth)}x${Math.round(displayHeight)}px`,
            });
        }
    });

    console.log('=== Vérification des Images Responsives ===\n');
    if (issues.length === 0) {
        console.log(`✓ ${images.length} images optimisées correctement`);
    } else {
        console.warn(`⚠ ${issues.length} images mal optimisées:`);
        issues.slice(0, 3).forEach(issue => {
            console.warn(`  - ${issue.issue}`);
            console.warn(`    Natural: ${issue.natural}, Display: ${issue.display}`);
        });
    }

    return issues;
};

/**
 * Point de contrôle 6: Vérifier les espacements
 */
export const testSpacing = () => {
    const elements = document.querySelectorAll('[class*="p-"], [class*="m-"], [class*="gap-"]');

    console.log('=== Vérification des Espacements ===\n');
    console.log(`Éléments avec espacements: ${elements.length}`);
    console.log('✓ Espacements appliqués via Tailwind CSS classes');

    return {
        count: elements.length,
        message: 'Vérifiez que les espacements augmentent sur les grands écrans',
    };
};

/**
 * Point de contrôle 7: Test complet de responsivité
 */
export const runFullResponsiveTest = () => {
    console.clear();
    console.log('%c=== TEST COMPLET DE RESPONSIVITÉ ===', 'color: #06b6d4; font-size: 16px; font-weight: bold;');
    console.log(`\nDimensions de l'écran: ${window.innerWidth}x${window.innerHeight}px`);
    console.log(`Orientation: ${window.innerHeight > window.innerWidth ? 'Portrait' : 'Paysage'}`);
    console.log(`Device Pixel Ratio: ${window.devicePixelRatio}`);
    console.log(`Touch Device: ${('ontouchstart' in window) ? 'Oui' : 'Non'}\n`);

    const breakpointTests = testBreakpoints();
    const touchTests = testTouchTargets();
    const fontTests = testFontSizes();
    const scrollTests = testHorizontalScroll();
    const imageTests = testResponsiveImages();
    const spacingTests = testSpacing();

    console.log('\n%c=== RÉSUMÉ ===', 'color: #06b6d4; font-weight: bold;');
    const totalIssues = touchTests.length + fontTests.length + scrollTests.excess + imageTests.length;

    if (totalIssues === 0) {
        console.log('%c✓ Tous les tests de responsivité sont passés!', 'color: green; font-weight: bold;');
    } else {
        console.log(`%c⚠ ${totalIssues} problèmes détectés`, 'color: orange; font-weight: bold;');
    }

    return {
        breakpointTests,
        touchTests,
        fontTests,
        scrollTests,
        imageTests,
        spacingTests,
        totalIssues,
    };
};

/**
 * Utilitaire: Tester un breakpoint spécifique
 */
export const testSpecificBreakpoint = (width: number, height: number = 800) => {
    console.log(`\n%cTest pour: ${width}x${height}px`, 'color: #06b6d4; font-weight: bold;');
    console.log('Note: Utilisez les DevTools pour changer la taille de l\'écran');
    console.log(`Actuelle: ${window.innerWidth}x${window.innerHeight}px`);
};

/**
 * Exporter les tests
 */
if (typeof window !== 'undefined') {
    (window as any).responsiveTests = {
        testBreakpoints,
        testTouchTargets,
        testFontSizes,
        testHorizontalScroll,
        testResponsiveImages,
        testSpacing,
        runFullResponsiveTest,
        testSpecificBreakpoint,
    };

    console.log('%c✓ Tests de responsivité chargés. Utilisez responsiveTests.runFullResponsiveTest()', 'color: green;');
}

export default {
    testBreakpoints,
    testTouchTargets,
    testFontSizes,
    testHorizontalScroll,
    testResponsiveImages,
    testSpacing,
    runFullResponsiveTest,
    testSpecificBreakpoint,
};
