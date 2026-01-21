import { useWorkouts } from "@/hooks/use-workouts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  TrendingUp, 
  Calendar, 
  Dumbbell, 
  Award,
  Clock,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { DailyIntakeCard } from "@/components/DailyIntakeCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Progress() {
  const { data: workouts = [] } = useWorkouts();

  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce((acc, w) => acc + w.exercises.length, 0);
  const totalSets = workouts.reduce((acc, w) => 
    acc + w.exercises.reduce((exAcc, ex) => exAcc + ex.sets.length, 0), 0
  );

  // Calculate workout history data for chart
  const workoutHistory = workouts
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((w, index) => ({
      date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      workouts: index + 1,
      exercises: w.exercises.length,
    }));

  const stats = [
    { label: "Total Workouts", value: totalWorkouts, icon: Calendar, color: "text-primary" },
    { label: "Exercises Done", value: totalExercises, icon: Dumbbell, color: "text-blue-500" },
    { label: "Total Sets", value: totalSets, icon: Zap, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-background pb-32 p-4 max-w-md mx-auto">
      <header className="pt-8 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Your <span className="text-primary">Progress</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Visualize your journey and achievements.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-card border-white/5 overflow-hidden relative cursor-pointer hover:border-primary/20 transition">
              <stat.icon className={`absolute right-4 top-1/2 -translate-y-1/2 h-16 w-16 opacity-5 ${stat.color}`} />
              <CardContent className="p-6">
                <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mb-1">{stat.label}</p>
                <p className="text-4xl font-black">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <DailyIntakeCard />

      {workoutHistory.length > 0 && (
        <Card className="bg-card border-white/5 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Workout Progress
            </CardTitle>
            <CardDescription>Your workout activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={workoutHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="workouts" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {workouts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Workouts
          </h2>
          <div className="space-y-3">
            {workouts.slice(0, 5).map((workout) => (
              <Card 
                key={workout.id} 
                className="bg-card border-white/5 hover:border-primary/20 transition cursor-pointer"
                onClick={() => window.location.href = `/workout/${workout.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{workout.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workout.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })} • {workout.exercises.length} exercises
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">
                        {workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} sets
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Award className="h-5 w-5 text-primary" />
        Recent Milestones
      </h2>

      <div className="space-y-4">
        {totalWorkouts >= 1 && (
          <Card className="bg-card border-white/5 p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-bold">First Step Taken</p>
              <p className="text-sm text-muted-foreground">Completed your first workout session.</p>
            </div>
          </Card>
        )}
        
        {totalWorkouts >= 5 && (
          <Card className="bg-card border-white/5 p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="font-bold">Consistency King</p>
              <p className="text-sm text-muted-foreground">Successfully logged 5 workouts.</p>
            </div>
          </Card>
        )}

        {totalWorkouts === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
            <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Complete workouts to see your stats!</p>
          </div>
        )}
      </div>
    </div>
  );
}
