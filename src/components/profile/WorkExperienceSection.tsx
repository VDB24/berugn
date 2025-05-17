
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkExperienceItem, { WorkExperience } from './WorkExperienceItem';
import WorkExperienceForm, { WorkExperienceFormData } from './WorkExperienceForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WorkExperienceSectionProps {
  items: WorkExperience[];
  onAdd: (data: WorkExperienceFormData) => Promise<void>;
  onUpdate: (id: string, data: WorkExperienceFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isSaving: boolean;
}

const WorkExperienceSection = ({ 
  items, 
  onAdd, 
  onUpdate, 
  onDelete,
  isSaving 
}: WorkExperienceSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<WorkExperience | null>(null);

  const openAddDialog = () => {
    setCurrentItem(null);
    setDialogOpen(true);
  };

  const openEditDialog = (item: WorkExperience) => {
    setCurrentItem(item);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentItem(null);
  };

  const handleSubmit = async (data: WorkExperienceFormData) => {
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
        Add Work Experience
      </Button>
      
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map(item => (
            <WorkExperienceItem 
              key={item.id} 
              item={item} 
              onEdit={openEditDialog} 
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          No work experience added yet. Add your professional history to enhance your profile.
        </p>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentItem ? 'Edit' : 'Add'} Work Experience
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="pr-4">
            <WorkExperienceForm 
              defaultValues={currentItem ? {
                company: currentItem.company,
                position: currentItem.position,
                location: currentItem.location || undefined,
                description: currentItem.description || undefined,
                current: currentItem.current,
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

export default WorkExperienceSection;
