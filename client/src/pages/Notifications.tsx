import { LocalNotifications } from "@capacitor/local-notifications";
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
    const t = localStorage.getItem("reminder_time");
    const e = localStorage.getItem("reminder_enabled");
    const d = localStorage.getItem("reminder_days");

    if (t) setReminderTime(t);
    if (e !== null) setEnabled(e === "true");
    if (d) setDays(JSON.parse(d));
  }, []);

  const toggleDay = (day: number) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    // 💾 сохраняем настройки
    localStorage.setItem("reminder_time", reminderTime);
    localStorage.setItem("reminder_enabled", String(enabled));
    localStorage.setItem("reminder_days", JSON.stringify(days));

    // ❗ ВСЕГДА удаляем старые уведомления
    await LocalNotifications.cancel({ notifications: [] });

    if (!enabled || days.length === 0) {
      toast({
        title: "Reminders disabled",
      });
      return;
    }

    const [hour, minute] = reminderTime.split(":").map(Number);

    // 🔔 создаём НОВЫЕ уведомления
    const notifications = days.map((day, index) => ({
      id: Date.now() + index, // ✅ уникальный id
      title: "Workout Time 💪",
      body: "Time to train",
      schedule: {
        on: { weekday: day, hour, minute },
        repeats: true,
      },
    }));

    await LocalNotifications.schedule({ notifications });

    toast({
      title: "Reminder saved",
      description: `Scheduled for ${days.length} day(s) at ${reminderTime}`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32 p-4 max-w-md mx-auto">
      <header className="pt-8 pb-6">
        <h1 className="text-4xl font-display font-extrabold">
          Notifications
        </h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Workout Reminder
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <Label>Enable</Label>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="space-y-2">
            <Label>Time</Label>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <Input
                type="time"
                value={reminderTime}
                disabled={!enabled}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Days</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button
                  key={d.value}
                  disabled={!enabled}
                  onClick={() => toggleDay(d.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium
                    ${
                      days.includes(d.value)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full mt-6 h-12 text-lg">
        <Save className="h-5 w-5 mr-2" />
        Save
      </Button>
    </div>
  );
}
