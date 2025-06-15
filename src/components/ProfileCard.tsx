
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, Star, ExternalLink, MapPin, Briefcase, User } from 'lucide-react';
import { type Profile } from '@/context/ProfileContext';

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
  onSuperConnect: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSwipe, onSuperConnect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? 'right' : 'left');
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? 'right' : 'left');
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setRotation(0);
  };

  const cardStyle = {
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    opacity: isDragging ? 0.9 : 1,
  };

  // Determine swipe direction for visual feedback
  const getSwipeColor = () => {
    if (!isDragging) return '';
    if (dragOffset.x > 50) return 'border-green-400 shadow-green-200';
    if (dragOffset.x < -50) return 'border-red-400 shadow-red-200';
    return '';
  };

  return (
    <>
      <style>
        {`
          .hover-scale {
            transition: transform 700ms ease-out;
          }
          
          .hover-scale:hover {
            transform: scale(1.02);
          }
          
          .image-scale {
            transition: transform 700ms ease-out;
          }
          
          .image-container:hover .image-scale {
            transform: scale(1.03);
          }
          
          .hover-translate {
            transition: transform 500ms ease-out;
          }
          
          .hover-translate:hover {
            transform: translateX(4px);
          }
          
          .hover-scale-sm {
            transition: transform 500ms ease-out;
          }
          
          .hover-scale-sm:hover {
            transform: scale(1.1);
          }
        `}
      </style>
      
      <div className="w-full max-w-sm mx-auto">
        <div 
          ref={cardRef}
          className={`bg-white dark:bg-zinc-900 rounded-3xl shadow-lg dark:shadow-2xl dark:shadow-black/80 overflow-hidden hover-scale cursor-grab active:cursor-grabbing select-none border-2 ${getSwipeColor()}`}
          style={cardStyle}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative overflow-hidden image-container">
            {profile.profileImage ? (
              <img 
                src={profile.profileImage}
                alt={profile.name} 
                className="w-full aspect-square object-cover image-scale"
                draggable={false}
              />
            ) : (
              <div className="w-full aspect-square bg-muted flex items-center justify-center image-scale">
                <User className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 dark:from-black/70 to-transparent pointer-events-none"></div>
            <div className="absolute top-6 left-6">
              <h2 className="text-2xl font-medium text-white drop-shadow-lg">{profile.name}</h2>
              <p className="text-sm text-white/90 drop-shadow-lg mt-1">
                {profile.jobTitle}{profile.company ? ` at ${profile.company}` : ''}
              </p>
            </div>
            {profile.linkedInUrl && (
              <div className="absolute top-6 right-6">
                <a 
                  href={profile.linkedInUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-200 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-5 w-5 drop-shadow-lg" />
                </a>
              </div>
            )}
          </div>
          
          <div className="p-6 space-y-4">
            {/* Industry and Experience */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                <Briefcase className="w-3 h-3 mr-1" />
                {profile.industry}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {profile.experience}
              </Badge>
            </div>
            
            {/* Skills */}
            <div className="flex flex-wrap gap-1">
              {profile.skills.slice(0, 4).map((skill) => (
                <Badge key={skill.id} variant="secondary" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
              {profile.skills.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{profile.skills.length - 4}
                </Badge>
              )}
            </div>
            
            {/* Bio */}
            <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-3">
              {profile.bio}
            </p>
            
            {/* Profile info */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden hover-scale-sm ring-2 ring-gray-200 dark:ring-zinc-700">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage}
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="hover-translate">
                  <div className="text-sm text-gray-700 dark:text-zinc-200">{profile.name}</div>
                  <div className="text-xs text-gray-500 dark:text-zinc-500">
                    {profile.industry}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="lg"
            className="h-14 w-14 rounded-full border-2 border-red-200 bg-white hover:bg-red-50 hover:border-red-300 hover:scale-110 transition-all duration-200"
            onClick={() => onSwipe('left')}
          >
            <X className="h-6 w-6 text-red-500" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-12 w-12 rounded-full border-2 border-yellow-200 bg-white hover:bg-yellow-50 hover:border-yellow-300 hover:scale-110 transition-all duration-200"
            onClick={onSuperConnect}
          >
            <Star className="h-5 w-5 text-yellow-500" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-14 w-14 rounded-full border-2 border-green-200 bg-white hover:bg-green-50 hover:border-green-300 hover:scale-110 transition-all duration-200"
            onClick={() => onSwipe('right')}
          >
            <Heart className="h-6 w-6 text-green-500" />
          </Button>
        </div>
        
        {/* Swipe hints */}
        <div className="flex justify-between items-center mt-4 px-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <X className="h-3 w-3" />
            Swipe left to pass
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            Swipe right to connect
          </span>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
