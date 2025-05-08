
import { useState } from 'react';
import { type Profile } from '@/context/ProfileContext';
import { useProfile } from '@/context/ProfileContext';
import { ExternalLink, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface PendingRequestCardProps {
  profile: Profile;
  connectionId: string;
}

const PendingRequestCard: React.FC<PendingRequestCardProps> = ({ profile, connectionId }) => {
  const { respondToRequest } = useProfile();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await respondToRequest(connectionId, true);
      toast({
        title: "Connection accepted",
        description: `You are now connected with ${profile.name}`,
      });
      setIsProcessed(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not accept connection request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await respondToRequest(connectionId, false);
      toast({
        title: "Request declined",
        description: `You declined ${profile.name}'s request`,
        variant: "default",
      });
      setIsProcessed(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process your response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isProcessed) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
      <div className="flex flex-col md:flex-row">
        {/* Profile image */}
        <div className="w-full md:w-40 h-44 md:h-auto shrink-0">
          {profile.profileImage ? (
            <img 
              src={profile.profileImage} 
              alt={profile.name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-3xl font-bold text-muted-foreground">
                {profile.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        {/* Profile details */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg mb-1">{profile.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {profile.jobTitle}{profile.company ? ` at ${profile.company}` : ''}
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-2">
              <Button 
                onClick={handleAccept} 
                disabled={isLoading}
                variant="default" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Accept
              </Button>
              <Button
                onClick={handleReject} 
                disabled={isLoading}
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Decline
              </Button>
            </div>
          </div>
          
          {/* Industry and experience badges */}
          <div className="mb-3">
            <Badge variant="outline" className="mr-2 mb-1">
              {profile.industry}
            </Badge>
            <Badge variant="outline" className="mr-2 mb-1">
              {profile.experience}
            </Badge>
          </div>
          
          {/* Skills */}
          <div className="mb-3 flex flex-wrap gap-1">
            {profile.skills.slice(0, 3).map((skill) => (
              <Badge key={skill.id} variant="secondary" className="mr-1 mb-1">
                {skill.name}
              </Badge>
            ))}
            {profile.skills.length > 3 && (
              <Badge variant="secondary" className="mr-1 mb-1">
                +{profile.skills.length - 3}
              </Badge>
            )}
          </div>
          
          {/* Bio preview */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {profile.bio}
          </p>
          
          {/* LinkedIn button */}
          {profile.linkedInUrl && (
            <div className="mt-3">
              <a 
                href={profile.linkedInUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 text-primary border-primary/20 hover:bg-primary/10 hover:text-primary"
                >
                  <ExternalLink size={14} />
                  LinkedIn
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingRequestCard;
