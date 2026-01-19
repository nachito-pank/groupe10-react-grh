import React from 'react';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
    children,
    className = '',
}) => {
    return (
        <div className={`container-responsive ${className}`}>
            {children}
        </div>
    );
};

interface ResponsiveGridProps {
    children: React.ReactNode;
    cols?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        '2xl'?: number;
    };
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
    children,
    cols = { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
    gap = 'md',
    className = '',
}) => {
    const { isDesktopXL } = useResponsive();

    const colsClass = isDesktopXL
        ? `grid-cols-${cols['2xl'] || cols.xl || cols.lg}`
        : `grid-cols-1 sm:grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg} xl:grid-cols-${cols.xl}`;

    const gapMap = {
        xs: 'gap-2',
        sm: 'gap-3',
        md: 'gap-4 md:gap-6',
        lg: 'gap-6 lg:gap-8',
        xl: 'gap-8 lg:gap-12',
    };

    return (
        <div className={`grid ${colsClass} ${gapMap[gap]} ${className}`}>
            {children}
        </div>
    );
};

interface ResponsiveCardProps {
    children: React.ReactNode;
    className?: string;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
    children,
    className = '',
}) => {
    return (
        <div className={`card-responsive ${className}`}>
            {children}
        </div>
    );
};

interface ResponsiveInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const ResponsiveInput = React.forwardRef<
    HTMLInputElement,
    ResponsiveInputProps
>(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs-fluid xs:text-sm-fluid font-medium text-gray-700 mb-1 xs:mb-2">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={`input-responsive ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
});

ResponsiveInput.displayName = 'ResponsiveInput';

interface ResponsiveTextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const ResponsiveTextarea = React.forwardRef<
    HTMLTextAreaElement,
    ResponsiveTextareaProps
>(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs-fluid xs:text-sm-fluid font-medium text-gray-700 mb-1 xs:mb-2">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                className={`input-responsive resize-none ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
});

ResponsiveTextarea.displayName = 'ResponsiveTextarea';

interface ResponsiveSelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const ResponsiveSelect = React.forwardRef<
    HTMLSelectElement,
    ResponsiveSelectProps
>(({ label, error, options, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs-fluid xs:text-sm-fluid font-medium text-gray-700 mb-1 xs:mb-2">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                className={`input-responsive ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            >
                <option value="">Sélectionner...</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
});

ResponsiveSelect.displayName = 'ResponsiveSelect';

interface ResponsiveButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const ResponsiveButton = React.forwardRef<
    HTMLButtonElement,
    ResponsiveButtonProps
>(
    (
        {
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            className = '',
            children,
            ...props
        },
        ref
    ) => {
        const variantMap = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700',
            secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
            danger: 'bg-red-600 text-white hover:bg-red-700',
            success: 'bg-green-600 text-white hover:bg-green-700',
        };

        const sizeMap = {
            sm: 'btn-responsive text-xs xs:text-xs',
            md: 'btn-responsive text-sm xs:text-sm',
            lg: 'btn-responsive text-base xs:text-base',
        };

        return (
            <button
                ref={ref}
                className={`${variantMap[variant]} ${sizeMap[size]} rounded-lg font-medium transition-colors duration-200 ${fullWidth ? 'w-full' : ''
                    } ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

ResponsiveButton.displayName = 'ResponsiveButton';
