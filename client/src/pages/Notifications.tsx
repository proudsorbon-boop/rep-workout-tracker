import { LocalNotifications, ScheduleOptions } from "@capacitor/local-notifications";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DAYS = [
  { label: "Mon", value: 2 },
  { label: "Tue", value: 3 },
  { label: "Wed", value: 4 },
  { label: "Thu", value: 5 },
  { label: "Fri", value: 6 },
  { label: "Sat", value: 7 },
  { label: "Sun", value: 1 },
];

export default function Notifications() {
  const { toast } = useToast();

  const [enabled, setEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [days, setDays] = useState<number[]>([]);

  useEffect(() => {
    const loadSettings = () => {
      const t = localStorage.getItem("reminder_time");
      const e = localStorage.getItem("reminder_enabled");
      const d = localStorage.getItem("reminder_days");

      if (t) setReminderTime(t);
      if (e !== null) setEnabled(e === "true");
      if (d) setDays(JSON.parse(d));
    };

    loadSettings();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const result = await LocalNotifications.requestPermissions();
      console.log("✅ Notification permissions:", result);
    } catch (e) {
      console.error("❌ Permission error:", e);
    }
  };

  const toggleDay = (day: number) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    localStorage.setItem("reminder_time", reminderTime);
    localStorage.setItem("reminder_enabled", String(enabled));
    localStorage.setItem("reminder_days", JSON.stringify(days));

    try {
      // ✅ Отменяем старые уведомления
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel(pending);
        console.log("✅ Cancelled old notifications");
      }
    } catch (e) {
      console.warn("Could not cancel notifications:", e);
    }

    if (!enabled || days.length === 0) {
      toast({
        title: "🔕 Reminders Disabled",
        description: "All reminders cancelled",
      });
      return;
    }

    const [hour, minute] = reminderTime.split(":").map(Number);
    const now = new Date();

    const notifications: ScheduleOptions = {
      notifications: days.map((day, index) => {
        // ✅ Вычисляем следующую дату для этого дня недели
        const nextDate = new Date();
        const currentDay = nextDate.getDay() || 7; // Воскресенье = 7
        const daysUntil = (day - currentDay + 7) % 7 || 7;
        nextDate.setDate(nextDate.getDate() + daysUntil);
        nextDate.setHours(hour, minute, 0, 0);

        return {
          id: 100 + index, // ✅ Уникальный ID для каждого дня
          title: "💪 Workout Time!",
          body: "Time to train! Let's get stronger today.",
          schedule: {
            at: nextDate,
            repeats: true,
            every: "week",
            allowWhileIdle: true,
          },
        };
      }),
    };

    try {
      console.log("📅 Scheduling notifications:", notifications);
      await LocalNotifications.schedule(notifications);

      toast({
        title: "✅ Reminders Saved!",
        description: `${days.length} reminder(s) set for ${reminderTime}`,
      });

      console.log("✅ Notifications scheduled successfully!");
    } catch (e) {
      console.error("❌ Schedule error:", e);
      toast({
        title: "❌ Error",
        description: "Could not save reminders. Check permissions.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32 p-4 max-w-md mx-auto">
      <header className="pt-8 pb-6">
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-foreground">
          Reminders
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Get notified when it's time to workout
        </p>
      </header>

      <Card className="bg-card border-white/5 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bell className="h-5 w-5 text-primary" />
            Workout Reminder
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
            <Label className="text-base font-bold">Enable Reminders</Label>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest ml-1">
              Reminder Time
            </Label>
            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <Clock className="h-5 w-5 text-primary" />
              <Input
                type="time"
                value={reminderTime}
                disabled={!enabled}
                className="bg-transparent border-none text-xl font-bold p-0 focus-visible:ring-0"
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest ml-1">
              Repeat On
            </Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button
                  key={d.value}
                  disabled={!enabled}
                  onClick={() => toggleDay(d.value)}
                  className={`flex-1 min-w-[60px] h-12 rounded-xl text-sm font-bold transition-all
                    ${
                      days.includes(d.value)
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-white/5 text-muted-foreground border border-white/5"
                    } ${!enabled && "opacity-50 cursor-not-allowed"}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={!enabled || days.length === 0}
        className="w-full mt-6 h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 disabled:opacity-50"
      >
        <Save className="h-5 w-5 mr-2" />
        Save Settings
      </Button>
    </div>
  );
}