
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EducationItem, { Education } from './EducationItem';
import EducationForm, { EducationFormData } from './EducationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EducationSectionProps {
  items: Education[];
  onAdd: (data: EducationFormData) => Promise<void>;
  onUpdate: (id: string, data: EducationFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isSaving: boolean;
}

const EducationSection = ({ 
  items, 
  onAdd, 
  onUpdate, 
  onDelete,
  isSaving 
}: EducationSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Education | null>(null);

  const openAddDialog = () => {
    setCurrentItem(null);
    setDialogOpen(true);
  };

  const openEditDialog = (item: Education) => {
    setCurrentItem(item);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentItem(null);
  };

  const handleSubmit = async (data: EducationFormData) => {
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
        Add Education
      </Button>
      
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map(item => (
            <EducationItem 
              key={item.id} 
              item={item} 
              onEdit={openEditDialog} 
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          No education added yet. Add your educational background to complete your profile.
        </p>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentItem ? 'Edit' : 'Add'} Education
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="pr-4">
            <EducationForm 
              defaultValues={currentItem ? {
                institution: currentItem.institution,
                degree: currentItem.degree,
                field_of_study: currentItem.field_of_study || undefined,
                description: currentItem.description || undefined,
                ...(currentItem.start_date && { start_date: new Date(currentItem.start_date) }),
                ...(currentItem.end_date && { end_date: new Date(currentItem.end_date) }),
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

export default EducationSection;
