
import { format } from 'date-fns';
import { Building, Calendar, Edit, Trash2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
  location: string | null;
  description: string | null;
}

interface WorkExperienceItemProps {
  item: WorkExperience;
  onEdit: (item: WorkExperience) => void;
  onDelete: (id: string) => void;
}

const WorkExperienceItem = ({ item, onEdit, onDelete }: WorkExperienceItemProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    return format(new Date(dateString), 'MMM yyyy');
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.position}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Building className="h-4 w-4 mr-1" />
              {item.company}
              {item.location && ` • ${item.location}`}
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(item.start_date)} - {item.current ? 'Present' : formatDate(item.end_date)}
        </div>
        {item.description && <p className="text-sm mt-2">{item.description}</p>}
      </CardContent>
    </Card>
  );
};

export default WorkExperienceItem;
