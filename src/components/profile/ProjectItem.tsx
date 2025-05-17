
import { format } from 'date-fns';
import { Calendar, Edit, Trash2, ExternalLink } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
}

interface ProjectItemProps {
  item: Project;
  onEdit: (item: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectItem = ({ item, onEdit, onDelete }: ProjectItemProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    return format(new Date(dateString), 'MMM yyyy');
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            {item.url && (
              <CardDescription className="flex items-center mt-1">
                <ExternalLink className="h-4 w-4 mr-1" />
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Project Link
                </a>
              </CardDescription>
            )}
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

export default ProjectItem;
