
import { format } from 'date-fns';
import { BadgeCheck, Calendar, Edit, Trash2, ExternalLink } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface Certificate {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date: string | null;
  expiration_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
}

interface CertificateItemProps {
  item: Certificate;
  onEdit: (item: Certificate) => void;
  onDelete: (id: string) => void;
}

const CertificateItem = ({ item, onEdit, onDelete }: CertificateItemProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    return format(new Date(dateString), 'MMM yyyy');
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <BadgeCheck className="h-4 w-4 mr-1" />
              {item.issuing_organization}
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
          {item.issue_date ? `Issued: ${formatDate(item.issue_date)}` : 'No issue date'}
          {item.expiration_date && ` • Expires: ${formatDate(item.expiration_date)}`}
        </div>
        {item.credential_id && (
          <div className="text-sm mt-2">
            <span className="font-medium">Credential ID:</span> {item.credential_id}
          </div>
        )}
        {item.credential_url && (
          <div className="text-sm mt-1">
            <a 
              href={item.credential_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Credential
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificateItem;
