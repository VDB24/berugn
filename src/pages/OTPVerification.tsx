
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
        description: 'Email not provided. Please go back to login.',
      });
      navigate('/login');
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
        title: 'Verification successful',
        description: 'You have been logged in successfully.',
      });
      navigate('/browse');
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Verify your account</h1>
            <p className="text-gray-600">
              Enter the 6-digit code sent to <span className="font-medium">{email}</span>
            </p>
          </div>
          
          <div className="bg-white shadow-lg rounded-xl p-8">
            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} index={index} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              
              <Button 
                onClick={handleVerifyOTP} 
                className="w-full"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify & Log in'}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive a code?
                </p>
                {countdown > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend code in {countdown} seconds
                  </p>
                ) : (
                  <Button 
                    variant="link" 
                    onClick={handleResendOTP} 
                    disabled={isLoading}
                    className="text-sm"
                  >
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
