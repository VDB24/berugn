
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectItem, { Project } from './ProjectItem';
import ProjectForm, { ProjectFormData } from './ProjectForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectsSectionProps {
  items: Project[];
  onAdd: (data: ProjectFormData) => Promise<void>;
  onUpdate: (id: string, data: ProjectFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isSaving: boolean;
}

const ProjectsSection = ({ 
  items, 
  onAdd, 
  onUpdate, 
  onDelete,
  isSaving 
}: ProjectsSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Project | null>(null);

  const openAddDialog = () => {
    setCurrentItem(null);
    setDialogOpen(true);
  };

  const openEditDialog = (item: Project) => {
    setCurrentItem(item);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentItem(null);
  };

  const handleSubmit = async (data: ProjectFormData) => {
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
        Add Project
      </Button>
      
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map(item => (
            <ProjectItem 
              key={item.id} 
              item={item} 
              onEdit={openEditDialog} 
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          No projects added yet. Showcase your work by adding projects to your profile.
        </p>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentItem ? 'Edit' : 'Add'} Project
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="pr-4">
            <ProjectForm 
              defaultValues={currentItem ? {
                title: currentItem.title,
                description: currentItem.description || undefined,
                url: currentItem.url || undefined,
                image_url: currentItem.image_url || undefined,
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

export default ProjectsSection;
