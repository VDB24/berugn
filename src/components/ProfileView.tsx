
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowLeft, MessageCircle, User, Briefcase, GraduationCap, Award, ListFilter } from 'lucide-react';
import { type Profile } from '@/context/ProfileContext';
import { useNavigate } from 'react-router-dom';

interface ProfileViewProps {
  profile: Profile;
  onBack?: () => void;
  showBackButton?: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onBack, showBackButton = true }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleMessage = () => {
    // Placeholder for messaging functionality
    console.log(`Opening message for ${profile.name}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {showBackButton && (
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      {/* Profile Header */}
      <div className="bg-card rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          {profile.profileImage && (
            <img 
              src={profile.profileImage} 
              alt={profile.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* LinkedIn link */}
          {profile.linkedInUrl && (
            <div className="absolute top-4 right-4">
              <a 
                href={profile.linkedInUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors"
              >
                <ExternalLink className="h-5 w-5 drop-shadow-lg" />
              </a>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg -mt-16 relative z-10">
                {profile.profileImage ? (
                  <img 
                    src={profile.profileImage}
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="mt-2">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-lg text-muted-foreground">
                  {profile.jobTitle}{profile.company ? ` at ${profile.company}` : ''}
                </p>
              </div>
            </div>
            
            <Button onClick={handleMessage} className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Message
            </Button>
          </div>
          
          {/* Industry and Experience */}
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.industry && (
              <Badge variant="outline" className="gap-1">
                <Briefcase className="h-3 w-3" />
                {profile.industry}
              </Badge>
            )}
            {profile.experience && (
              <Badge variant="outline">
                {profile.experience}
              </Badge>
            )}
          </div>
          
          {/* Skills */}
          {profile.skills.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bio Section */}
      {profile.bio && (
        <div className="bg-card rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
        </div>
      )}
      
      {/* Placeholder sections for extended profile data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Experience</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Professional experience details would be displayed here.
          </p>
        </div>
        
        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Education</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Education details would be displayed here.
          </p>
        </div>
        
        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ListFilter className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Projects</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Project details would be displayed here.
          </p>
        </div>
        
        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Certificates</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Certificate details would be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
