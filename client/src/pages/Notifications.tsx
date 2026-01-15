import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Save, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const { toast } = useToast();
  const [reminderTime, setReminderTime] = useState("08:00");

  useEffect(() => {
    const savedTime = localStorage.getItem("reminder_time");
    if (savedTime) setReminderTime(savedTime);
  }, []);

  const handleSave = () => {
    localStorage.setItem("reminder_time", reminderTime);
    toast({
      title: "Settings Saved",
      description: `We'll remind you at ${reminderTime} (Logic only for now).`,
    });
    console.log(`Notification reminder set for: ${reminderTime}`);
  };

  return (
    <div className="min-h-screen bg-background pb-32 p-4 max-w-md mx-auto">
      <header className="pt-8 pb-6">
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-foreground">
          Notification <span className="text-primary">Settings</span>
        </h1>
      </header>

      <div className="space-y-6">
        <Card className="bg-card border-white/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Workout Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="time">Reminder Time</Label>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="bg-background/50 h-12 text-lg"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
              <Info className="h-5 w-5 text-blue-500 shrink-0" />
              <p className="text-xs text-blue-200 leading-relaxed">
                Real push notifications require Android permissions. This logic is prepared for Capacitor implementation.
              </p>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full h-12 text-lg font-bold gap-2 shadow-lg shadow-primary/20">
          <Save className="h-5 w-5" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
