
import { useState, useRef, useEffect } from 'react';
import { type Profile } from '@/context/ProfileContext';
import { Badge } from '@/components/ui/badge';
import { 
  calculateSwipeResult, 
  getCardRotation, 
  getCardTransform, 
  resetCardStyle, 
  animateCardSwipe 
} from '@/utils/swipeUtils';
import { CheckCircle, XCircle, ExternalLink, Star } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
  onSuperConnect?: () => void;
  isActive?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  onSwipe, 
  onSuperConnect,
  isActive = true 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(0);
  const [swipeIndicator, setSwipeIndicator] = useState<'left' | 'right' | null>(null);

  // Handle pointer down
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isActive) return;
    
    // Save starting position and time
    setStartPos({ x: e.clientX, y: e.clientY });
    setCurrentPos({ x: e.clientX, y: e.clientY });
    setStartTime(Date.now());
    setIsDragging(true);
    
    // Capture pointer to track movement even outside the element
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
  };

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isActive) return;
    
    // Update current position
    setCurrentPos({ x: e.clientX, y: e.clientY });
    
    // Calculate movement offset
    const offsetX = e.clientX - startPos.x;
    const offsetY = e.clientY - startPos.y;
    
    // Get rotation based on horizontal movement
    const rotation = getCardRotation(offsetX, cardRef.current?.offsetWidth || 400);
    
    // Apply transform to card
    if (cardRef.current) {
      cardRef.current.style.transform = getCardTransform({ x: offsetX, y: offsetY }, rotation);
      cardRef.current.style.transition = '';
    }
    
    // Set swipe indicator based on horizontal movement
    if (offsetX > 80) {
      setSwipeIndicator('right');
    } else if (offsetX < -80) {
      setSwipeIndicator('left');
    } else {
      setSwipeIndicator(null);
    }
  };

  // Handle pointer up / end of drag
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !isActive) return;
    
    // Calculate swipe result
    const endTime = Date.now();
    const swipeResult = calculateSwipeResult(
      startPos,
      { x: e.clientX, y: e.clientY },
      startTime,
      endTime
    );
    
    // Reset state
    setIsDragging(false);
    setSwipeIndicator(null);
    
    // Handle horizontal swipes
    if (swipeResult.direction === 'left' || swipeResult.direction === 'right') {
      // Animate card swipe
      if (cardRef.current) {
        animateCardSwipe(cardRef.current, swipeResult.direction);
      }
      
      // Call onSwipe after animation
      setTimeout(() => {
        onSwipe(swipeResult.direction as 'left' | 'right');
      }, 300);
    } else {
      // Reset card position if no significant swipe
      if (cardRef.current) {
        resetCardStyle(cardRef.current);
      }
    }
    
    // Release pointer capture
    if (cardRef.current) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }
  };

  // Handle left swipe button click
  const handleLeftClick = () => {
    if (!isActive) return;
    
    if (cardRef.current) {
      animateCardSwipe(cardRef.current, 'left');
    }
    
    setTimeout(() => {
      onSwipe('left');
    }, 300);
  };

  // Handle right swipe button click
  const handleRightClick = () => {
    if (!isActive) return;
    
    if (cardRef.current) {
      animateCardSwipe(cardRef.current, 'right');
    }
    
    setTimeout(() => {
      onSwipe('right');
    }, 300);
  };

  // Handle super connect button click
  const handleSuperConnectClick = () => {
    if (!isActive || !onSuperConnect) return;
    onSuperConnect();
  };

  return (
    <div className="card-swipe-container w-full max-w-sm mx-auto">
      <div
        ref={cardRef}
        className={`card-shadow bg-white rounded-xl overflow-hidden transition-card ${
          isActive ? 'card-hover' : 'opacity-90'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Swipe indicators */}
        {swipeIndicator === 'left' && (
          <div className="absolute left-4 top-4 z-10 bg-destructive text-white font-bold py-1 px-3 rounded-full transform -rotate-12 animate-pulse border-2 border-white">
            PASS
          </div>
        )}
        {swipeIndicator === 'right' && (
          <div className="absolute right-4 top-4 z-10 bg-success text-white font-bold py-1 px-3 rounded-full transform rotate-12 animate-pulse border-2 border-white">
            CONNECT
          </div>
        )}

        {/* Profile image */}
        <div className="relative h-72 w-full bg-gray-100">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <span className="text-2xl font-bold text-muted-foreground">
                {profile.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Profile info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            {profile.linkedInUrl && (
              <a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>

          <p className="text-muted-foreground mb-3">
            {profile.jobTitle}{profile.company ? ` at ${profile.company}` : ''}
          </p>

          <div className="mb-4">
            <Badge variant="outline" className="mr-2 mb-2">
              {profile.industry}
            </Badge>
            <Badge variant="outline" className="mr-2 mb-2">
              {profile.experience}
            </Badge>
          </div>

          <div className="mb-4 flex flex-wrap gap-1">
            {profile.skills.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="mr-1 mb-1">
                {skill.name}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">{profile.bio}</p>
        </div>
      </div>

      {/* Action buttons */}
      {isActive && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handleLeftClick}
            className="h-14 w-14 flex items-center justify-center rounded-full bg-destructive/10 text-destructive transition-transform hover:scale-110"
          >
            <XCircle size={30} />
          </button>

          {onSuperConnect && (
            <button
              onClick={handleSuperConnectClick}
              className="h-12 w-12 flex items-center justify-center rounded-full bg-secondary/10 text-secondary transition-transform hover:scale-110"
            >
              <Star size={26} />
            </button>
          )}

          <button
            onClick={handleRightClick}
            className="h-14 w-14 flex items-center justify-center rounded-full bg-success/10 text-success transition-transform hover:scale-110"
          >
            <CheckCircle size={30} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
