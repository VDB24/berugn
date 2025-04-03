
import { useState, useEffect } from 'react';
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
import { ArrowRight, RefreshCw, Loader2 } from 'lucide-react';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { verifyOTP, resendOTP, isLoading } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    // Get email from location state
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
  }, [location, navigate, toast]);
  
  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
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
      setCountdown(30);
      toast({
        title: 'OTP resent',
        description: 'A new OTP has been sent to your email.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to resend OTP',
        description: 'Please try again later.',
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gradient">Verify your account</h1>
            <p className="text-muted-foreground text-lg">
              Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
          
          <div className="bg-card border rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
            <div className="space-y-8">
              <div className="flex justify-center">
                <InputOTP
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
              
              <Button 
                onClick={handleVerifyOTP} 
                className="w-full h-12 text-base group"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <>
                    Complete Sign Up
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Didn't receive a code?
                </p>
                {countdown > 0 ? (
                  <div className="flex items-center justify-center text-sm space-x-2 text-muted-foreground">
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Resend code in {countdown} seconds</span>
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OTPVerification;
