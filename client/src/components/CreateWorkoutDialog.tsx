import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWorkoutSchema } from "@shared/schema";
import { useCreateWorkout } from "@/hooks/use-workouts";
import { useState } from "react";
import { z } from "zod";

type FormValues = z.infer<typeof insertWorkoutSchema>;

export function CreateWorkoutDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateWorkout();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(insertWorkoutSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300"
        >
          <Plus className="h-6 w-6 text-primary-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold">New Workout</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Workout Name</label>
            <Input
              {...form.register("name")}
              placeholder="e.g. Leg Day, Upper Body Push..."
              className="bg-background border-input focus:border-primary text-lg py-6"
              autoFocus
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="hover:bg-muted"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending ? "Creating..." : "Start Workout"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
