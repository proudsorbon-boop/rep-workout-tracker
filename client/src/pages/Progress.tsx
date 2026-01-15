import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Trophy, Target, Star, Zap, Shield, Crown } from "lucide-react";
import { motion } from "framer-motion";

const achievements = [
  { id: 1, title: "First Workout", icon: Star, color: "text-yellow-500", earned: true },
  { id: 2, title: "7 Day Streak", icon: Zap, color: "text-orange-500", earned: true },
  { id: 3, title: "Weight Warrior", icon: Shield, color: "text-blue-500", earned: false },
  { id: 4, title: "Master Lifter", icon: Crown, color: "text-purple-500", earned: false },
];

export default function Progress() {
  return (
    <div className="min-h-screen bg-background pb-32 p-4 max-w-md mx-auto">
      <header className="pt-8 pb-6">
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-foreground">
          Your <span className="text-primary">Progress</span>
        </h1>
      </header>

      <div className="space-y-6">
        <Card className="bg-card border-white/5 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-5 w-5 text-primary" />
              Weekly Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-black">75%</span>
              <span className="text-sm text-muted-foreground">3 of 4 sessions</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-white/5 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart className="h-5 w-5 text-primary" />
              Volume Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48 flex items-end gap-2 px-2 pb-2">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex-1 bg-primary/20 rounded-t-sm relative group"
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm" />
              </motion.div>
            ))}
          </CardContent>
          <div className="flex justify-between px-6 pb-4 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-display font-black flex items-center gap-2 px-2">
            <Trophy className="h-5 w-5 text-primary" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <Card 
                key={ach.id} 
                className={`bg-card border-white/5 p-4 flex flex-col items-center text-center gap-3 transition-all ${
                  !ach.earned && "opacity-40 grayscale"
                }`}
              >
                <div className={`p-3 rounded-2xl bg-white/5 ${ach.color}`}>
                  <ach.icon className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-bold block">{ach.title}</span>
                  <Badge variant="outline" className="text-[9px] h-4 py-0">
                    {ach.earned ? "Unlocked" : "Locked"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
