
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CertificateItem, { Certificate } from './CertificateItem';
import CertificateForm, { CertificateFormData } from './CertificateForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CertificatesSectionProps {
  items: Certificate[];
  onAdd: (data: CertificateFormData) => Promise<void>;
  onUpdate: (id: string, data: CertificateFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isSaving: boolean;
}

const CertificatesSection = ({ 
  items, 
  onAdd, 
  onUpdate, 
  onDelete,
  isSaving 
}: CertificatesSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Certificate | null>(null);

  const openAddDialog = () => {
    setCurrentItem(null);
    setDialogOpen(true);
  };

  const openEditDialog = (item: Certificate) => {
    setCurrentItem(item);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentItem(null);
  };

  const handleSubmit = async (data: CertificateFormData) => {
    if (currentItem) {
      await onUpdate(currentItem.id, data);
    } else {
      await onAdd(data);
    }
    closeDialog();
  };

  return (
    <div className="pt-4 pb-2">
      <Button 
        onClick={openAddDialog}
        className="mb-4"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Certificate
      </Button>
      
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map(item => (
            <CertificateItem 
              key={item.id} 
              item={item} 
              onEdit={openEditDialog} 
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          No certificates added yet. Add your certifications to highlight your skills and qualifications.
        </p>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentItem ? 'Edit' : 'Add'} Certificate
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="pr-4">
            <CertificateForm 
              defaultValues={currentItem ? {
                name: currentItem.name,
                issuing_organization: currentItem.issuing_organization,
                credential_id: currentItem.credential_id || undefined,
                credential_url: currentItem.credential_url || undefined,
                ...(currentItem.issue_date && { issue_date: new Date(currentItem.issue_date) }),
                ...(currentItem.expiration_date && { expiration_date: new Date(currentItem.expiration_date) }),
              } : undefined}
              onSubmit={handleSubmit}
              onCancel={closeDialog}
              isSaving={isSaving}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificatesSection;
