
type Direction = 'left' | 'right' | 'up' | 'down';

interface Position {
  x: number;
  y: number;
}

interface SwipeResult {
  direction: Direction | null;
  offset: Position;
  velocity: Position;
}

// Calculate swipe direction based on start and end positions
export const getSwipeDirection = (
  startPos: Position,
  endPos: Position, 
  minSwipeDistance = 50
): Direction | null => {
  const deltaX = endPos.x - startPos.x;
  const deltaY = endPos.y - startPos.y;
  
  // Check if swipe distance is significant enough
  if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
    return null;
  }
  
  // Determine if the swipe is primarily horizontal or vertical
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left';
  } else {
    return deltaY > 0 ? 'down' : 'up';
  }
};

// Calculate swipe result with direction, offset and velocity
export const calculateSwipeResult = (
  startPos: Position,
  endPos: Position,
  startTime: number,
  endTime: number,
  minSwipeDistance = 50
): SwipeResult => {
  const direction = getSwipeDirection(startPos, endPos, minSwipeDistance);
  const timeElapsed = endTime - startTime; // in ms
  
  const offset = {
    x: endPos.x - startPos.x,
    y: endPos.y - startPos.y
  };
  
  // Calculate velocity in pixels per second
  const velocity = {
    x: timeElapsed > 0 ? offset.x / (timeElapsed / 1000) : 0,
    y: timeElapsed > 0 ? offset.y / (timeElapsed / 1000) : 0
  };
  
  return {
    direction,
    offset,
    velocity
  };
};

// Get transform string for card animation
export const getCardTransform = (offset: Position, rotation = 0): string => {
  return `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`;
};

// Apply rotation based on horizontal movement
export const getCardRotation = (offsetX: number, cardWidth: number): number => {
  // Calculate rotation based on horizontal offset relative to card width
  const maxRotation = 10; // Maximum rotation in degrees
  return (offsetX / cardWidth) * maxRotation;
};

// Helper functions for card animations
export const resetCardStyle = (element: HTMLElement): void => {
  element.style.transform = '';
  element.style.transition = 'transform 0.3s ease';
};

export const animateCardSwipe = (
  element: HTMLElement, 
  direction: 'left' | 'right'
): void => {
  const windowWidth = window.innerWidth;
  const rotation = direction === 'right' ? 20 : -20;
  
  // Set transform for swipe animation
  element.style.transform = `translateX(${direction === 'right' ? windowWidth : -windowWidth}px) rotate(${rotation}deg)`;
  element.style.transition = 'transform 0.6s ease-out';
};
