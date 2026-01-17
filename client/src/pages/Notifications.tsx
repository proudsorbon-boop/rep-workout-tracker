import { LocalNotifications } from "@capacitor/local-notifications";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, Save, Info } from "lucide-react";
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
    try {
      await LocalNotifications.cancel({ notifications: [] });
    } catch (e) {
      console.warn("LocalNotifications not available");
    }

    if (!enabled || days.length === 0) {
      toast({
        title: "Reminders disabled",
      });
      return;
    }

    const [hour, minute] = reminderTime.split(":").map(Number);

    // 🔔 создаём НОВЫЕ уведомления
    const notifications = days.map((day, index) => ({
      id: Math.floor(Math.random() * 1000000), // ✅ уникальный id
      title: "Workout Time 💪",
      body: "Time to train",
      schedule: {
        on: { weekday: day, hour, minute },
        repeats: true,
      },
    }));

    try {
      await LocalNotifications.schedule({ notifications });
    } catch (e) {
      console.warn("LocalNotifications not available");
    }

    toast({
      title: "Reminder saved",
      description: `Scheduled for ${days.length} day(s) at ${reminderTime}`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32 p-4 max-w-md mx-auto">
      <header className="pt-8 pb-6">
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-foreground">
          Notifications
        </h1>
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
            <Label className="text-base font-bold">Enable</Label>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest ml-1">Time</Label>
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
            <Label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest ml-1">Days</Label>
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
                    } ${!enabled && "opacity-50"}`}
                >
                  {d.label}
                </button>
              ))}
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

      <Button 
        onClick={handleSave} 
        className="w-full mt-6 h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20"
      >
        <Save className="h-5 w-5 mr-2" />
        Save Settings
      </Button>
    </div>
  );
}
