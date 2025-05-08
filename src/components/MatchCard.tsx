
import { type Profile } from '@/context/ProfileContext';
import { ExternalLink, MessageCircle, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MatchCardProps {
  profile: Profile;
  isConnected?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ profile, isConnected = false }) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
      <div className="flex flex-col md:flex-row">
        {/* Profile image */}
        <div className="w-full md:w-40 h-44 md:h-auto shrink-0 relative">
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
          
          {/* Connected badge */}
          {isConnected && (
            <div className="absolute top-2 left-2">
              <Badge variant="default" className="bg-success text-white">
                <Check size={12} className="mr-1" />
                Connected
              </Badge>
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
            {/* LinkedIn button */}
            {profile.linkedInUrl && (
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
            )}
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
          
          {/* Message button */}
          <div className="mt-3">
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2"
            >
              <MessageCircle size={16} />
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
