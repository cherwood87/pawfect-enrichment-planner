/**
 * Enhanced Form Components with Mobile Optimization
 * Provides better touch targets and mobile-friendly form interactions
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

// Enhanced Input with mobile optimization
interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  validating?: boolean;
  success?: boolean;
  helpText?: string;
  showPasswordToggle?: boolean;
  mobileOptimized?: boolean;
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  error,
  validating,
  success,
  helpText,
  showPasswordToggle = false,
  mobileOptimized = true,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = props.type === 'password';
  const inputType = isPassword && showPassword ? 'text' : props.type;

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={props.id}
          className={cn(
            "text-sm font-medium",
            mobileOptimized && "text-base sm:text-sm" // Larger text on mobile
          )}
        >
          {label}
        </Label>
      )}
      
      <div className="relative">
        <Input
          {...props}
          type={inputType}
          className={cn(
            // Mobile-first sizing
            mobileOptimized && [
              "h-12 sm:h-10", // Taller on mobile
              "text-base sm:text-sm", // Larger text on mobile
              "px-4 sm:px-3" // More padding on mobile
            ],
            // State-based styling
            error && "border-destructive focus-visible:ring-destructive",
            success && "border-success focus-visible:ring-success",
            validating && "border-warning",
            // Touch improvements
            "touch-manipulation",
            className
          )}
        />
        
        {/* Password toggle */}
        {isPassword && showPasswordToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
              mobileOptimized && "min-w-[44px]" // Minimum touch target
            )}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        )}
        
        {/* Status indicators */}
        {(error || success || validating) && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            {validating && (
              <div className="animate-spin h-4 w-4 border-2 border-warning border-t-transparent rounded-full" />
            )}
            {error && <AlertCircle className="h-4 w-4 text-destructive" />}
            {success && <CheckCircle2 className="h-4 w-4 text-success" />}
          </div>
        )}
      </div>
      
      {/* Help text and errors */}
      <div className="min-h-[1.25rem]">
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            {error}
          </p>
        )}
        {!error && helpText && (
          <p className="text-sm text-muted-foreground">{helpText}</p>
        )}
      </div>
    </div>
  );
};

// Enhanced Textarea with mobile optimization
interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | null;
  validating?: boolean;
  success?: boolean;
  helpText?: string;
  mobileOptimized?: boolean;
  autoResize?: boolean;
}

export const EnhancedTextarea: React.FC<EnhancedTextareaProps> = ({
  label,
  error,
  validating,
  success,
  helpText,
  mobileOptimized = true,
  autoResize = false,
  className,
  ...props
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      const adjustHeight = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      
      textarea.addEventListener('input', adjustHeight);
      adjustHeight(); // Initial adjustment
      
      return () => textarea.removeEventListener('input', adjustHeight);
    }
  }, [autoResize]);

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={props.id}
          className={cn(
            "text-sm font-medium",
            mobileOptimized && "text-base sm:text-sm"
          )}
        >
          {label}
        </Label>
      )}
      
      <div className="relative">
        <Textarea
          ref={textareaRef}
          {...props}
          className={cn(
            // Mobile-first sizing
            mobileOptimized && [
              "min-h-[120px] sm:min-h-[100px]", // Taller on mobile
              "text-base sm:text-sm", // Larger text on mobile
              "px-4 py-3 sm:px-3 sm:py-2" // More padding on mobile
            ],
            // State-based styling
            error && "border-destructive focus-visible:ring-destructive",
            success && "border-success focus-visible:ring-success",
            validating && "border-warning",
            // Touch improvements
            "touch-manipulation resize-none",
            autoResize && "overflow-hidden",
            className
          )}
        />
        
        {/* Status indicators */}
        {(error || success || validating) && (
          <div className="absolute right-2 top-2 pointer-events-none">
            {validating && (
              <div className="animate-spin h-4 w-4 border-2 border-warning border-t-transparent rounded-full" />
            )}
            {error && <AlertCircle className="h-4 w-4 text-destructive" />}
            {success && <CheckCircle2 className="h-4 w-4 text-success" />}
          </div>
        )}
      </div>
      
      {/* Help text and errors */}
      <div className="min-h-[1.25rem]">
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            {error}
          </p>
        )}
        {!error && helpText && (
          <p className="text-sm text-muted-foreground">{helpText}</p>
        )}
      </div>
    </div>
  );
};

// Enhanced Select with mobile optimization
interface EnhancedSelectProps {
  label?: string;
  error?: string | null;
  validating?: boolean;
  success?: boolean;
  helpText?: string;
  placeholder?: string;
  mobileOptimized?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  label,
  error,
  validating,
  success,
  helpText,
  placeholder,
  mobileOptimized = true,
  value,
  onValueChange,
  children
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label className={cn(
          "text-sm font-medium",
          mobileOptimized && "text-base sm:text-sm"
        )}>
          {label}
        </Label>
      )}
      
      <div className="relative">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className={cn(
            // Mobile-first sizing
            mobileOptimized && [
              "h-12 sm:h-10", // Taller on mobile
              "text-base sm:text-sm", // Larger text on mobile
              "px-4 sm:px-3" // More padding on mobile
            ],
            // State-based styling
            error && "border-destructive focus:ring-destructive",
            success && "border-success focus:ring-success",
            validating && "border-warning",
            // Touch improvements
            "touch-manipulation"
          )}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className={cn(
            mobileOptimized && "text-base sm:text-sm"
          )}>
            {children}
          </SelectContent>
        </Select>
        
        {/* Status indicators */}
        {(error || success || validating) && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
            {validating && (
              <div className="animate-spin h-4 w-4 border-2 border-warning border-t-transparent rounded-full" />
            )}
            {error && <AlertCircle className="h-4 w-4 text-destructive" />}
            {success && <CheckCircle2 className="h-4 w-4 text-success" />}
          </div>
        )}
      </div>
      
      {/* Help text and errors */}
      <div className="min-h-[1.25rem]">
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            {error}
          </p>
        )}
        {!error && helpText && (
          <p className="text-sm text-muted-foreground">{helpText}</p>
        )}
      </div>
    </div>
  );
};

// Enhanced Button with mobile optimization
interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  mobileOptimized?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  loading = false,
  mobileOptimized = true,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      className={cn(
        // Mobile-first sizing
        mobileOptimized && [
          "h-12 sm:h-10", // Taller on mobile
          "text-base sm:text-sm", // Larger text on mobile
          "px-6 sm:px-4", // More padding on mobile
          "min-w-[44px]" // Minimum touch target
        ],
        // Touch improvements
        "touch-manipulation",
        className
      )}
    >
      {loading && (
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
      )}
      {children}
    </Button>
  );
};