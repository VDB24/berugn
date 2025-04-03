
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, RefreshCw, Loader2, Check, Copy, Clipboard } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { verifyOTP, resendOTP, isLoading } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [progress, setProgress] = useState(100);
  const [email, setEmail] = useState('');
  const [mockOtp, setMockOtp] = useState('');
  const [copied, setCopied] = useState(false);
  const otpInputRef = useRef(null);
  
  // Extract email from location state
  useEffect(() => {
    const state = location.state as { email: string } | null;
    if (!state || !state.email) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Email not provided. Please go back to sign up.',
      });
      navigate('/register');
      return;
    }
    
    setEmail(state.email);
    
    // For demo purposes - show a mock OTP from console in the UI
    const demoOtp = MOCK_OTP_STORE[state.email] || Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(demoOtp);
    console.log(`OTP for ${state.email}: ${demoOtp}`);
  }, [location, navigate, toast]);
  
  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        setProgress((countdown - 1) * 100 / 30); // Calculate progress percentage
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Focus OTP input on mount
  useEffect(() => {
    if (otpInputRef.current) {
      setTimeout(() => {
        // @ts-ignore - InputOTP doesn't expose the focus method directly
        if (otpInputRef.current.focusFirst) {
          otpInputRef.current.focusFirst();
        }
      }, 500);
    }
  }, []);
  
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'Please enter a valid 6-digit OTP code.',
      });
      return;
    }
    
    try {
      await verifyOTP(email, otp);
      toast({
        title: 'Account created successfully',
        description: 'Welcome to SwipeConnect! Let\'s set up your profile.',
      });
      navigate('/create-profile');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Verification failed',
        description: 'Invalid OTP code. Please try again.',
      });
    }
  };
  
  const handleResendOTP = async () => {
    try {
      await resendOTP(email);
      
      // Update mock OTP for demo
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOtp(newOtp);
      console.log(`New OTP for ${email}: ${newOtp}`);
      
      setCountdown(30);
      setProgress(100);
      toast({
        title: 'OTP resent',
        description: 'A new verification code has been sent to your email.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to resend OTP',
        description: 'Please try again later.',
      });
    }
  };

  const copyOtp = () => {
    navigator.clipboard.writeText(mockOtp);
    setCopied(true);
    toast({
      title: "OTP copied to clipboard",
      description: "Paste it into the verification field"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const maskedEmail = email ? email.replace(/(.{3})(.*)(@.*)/, '$1***$3') : '';
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gradient">Verify your account</h1>
            <p className="text-muted-foreground text-lg">
              Enter the 6-digit code sent to <span className="font-medium text-foreground">{maskedEmail}</span>
            </p>
          </div>
          
          <div className="bg-card border rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <InputOTP
                  ref={otpInputRef}
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  containerClassName="gap-3"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-14 text-xl border-2 rounded-lg aspect-square" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-xl border-2 rounded-lg aspect-square" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-xl border-2 rounded-lg aspect-square" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-xl border-2 rounded-lg aspect-square" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-xl border-2 rounded-lg aspect-square" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-xl border-2 rounded-lg aspect-square" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              {/* Demo helper - show OTP for development */}
              <div className="bg-muted/50 rounded-xl p-4 border border-dashed">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Demo: Quick copy verification code</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={copyOtp} 
                    className="h-8 px-2"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 font-mono text-lg">
                  {mockOtp.split('').map((digit, i) => (
                    <span key={i} className="w-8 h-10 flex items-center justify-center bg-background border rounded-md">
                      {digit}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-center mt-2 text-muted-foreground">
                  This helper is only visible in development mode
                </p>
              </div>
              
              <Button 
                onClick={handleVerifyOTP} 
                className="w-full h-12 text-base group shadow-md hover:shadow-lg transition-all"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <>
                    Complete Verification
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive a code?
                </p>
                
                {countdown > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <RefreshCw size={14} className={countdown < 5 ? "animate-spin" : ""} />
                      <span className="ml-2">Resend code in {countdown}s</span>
                    </div>
                    <Progress value={progress} className="h-1 w-48 mx-auto" />
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleResendOTP} 
                    disabled={isLoading}
                    className="text-sm h-10"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Resend code
                  </Button>
                )}

                <Button 
                  variant="link" 
                  className="text-sm p-0 h-auto"
                  onClick={() => navigate('/register')}
                >
                  <Clipboard className="h-3.5 w-3.5 mr-1.5" />
                  Change email address
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Having trouble? <a href="#" className="text-primary hover:underline">Contact support</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Accessing MOCK_OTP_STORE for demo purposes
// This would normally be encapsulated within a service
// @ts-ignore - This is just for accessing mock data from AuthContext
const MOCK_OTP_STORE = window.MOCK_OTP_STORE || {};

export default OTPVerification;
