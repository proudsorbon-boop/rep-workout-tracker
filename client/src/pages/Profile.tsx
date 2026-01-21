import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Save, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface UserProfileData {
  name: string;
  age: string;
  height: string;
  weight: string;
  goal: string;
  activityLevel: string;
}

export default function Profile() {
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfileData>({
    name: "",
    age: "",
    height: "",
    weight: "",
    goal: "stay_fit",
    activityLevel: "1.2",
  });

  useEffect(() => {
    const saved = localStorage.getItem("user_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("user_profile", JSON.stringify(profile));
    toast({
      title: "Profile Saved",
      description: "Your fitness profile has been updated.",
    });
  };

  // 🧮 Calorie calculation (safe)
  const calculateCalories = () => {
    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const age = Number(profile.age);
    const activity = Number(profile.activityLevel);

    if (
      !weight ||
      !height ||
      !age ||
      weight <= 0 ||
      height <= 0 ||
      age <= 0
    ) {
      return null;
    }

    // Harris–Benedict (simplified)
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    return Math.round(bmr * activity);
  };

  // 🥗 Macro calculation
  const calculateMacros = (calories: number) => {
    // Standard macro split: 30% protein, 40% carbs, 30% fats
    const proteinGrams = Math.round((calories * 0.30) / 4); // 4 cal per gram
    const carbsGrams = Math.round((calories * 0.40) / 4); // 4 cal per gram
    const fatsGrams = Math.round((calories * 0.30) / 9); // 9 cal per gram
    
    return { proteinGrams, carbsGrams, fatsGrams };
  };

  const dailyCalories = calculateCalories();
  const macros = dailyCalories ? calculateMacros(dailyCalories) : null;

  return (
    <div className="min-h-screen bg-background pb-24 p-4 max-w-md mx-auto">
      {/* HEADER */}
      <header className="pt-8 pb-6">
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-foreground">
          User <span className="text-primary">Profile</span>
        </h1>
      </header>

      <div className="space-y-6">
        {/* PERSONAL INFO */}
        <Card className="bg-card border-white/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Info
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                placeholder="Your name"
                className="bg-background/50"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input
                  type="number"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: e.target.value })
                  }
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input
                  type="number"
                  value={profile.height}
                  onChange={(e) =>
                    setProfile({ ...profile, height: e.target.value })
                  }
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  value={profile.weight}
                  onChange={(e) =>
                    setProfile({ ...profile, weight: e.target.value })
                  }
                  className="bg-background/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GOALS */}
        <Card className="bg-card border-white/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Goals & Nutrition
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Fitness Goal</Label>
              <Select
                value={profile.goal}
                onValueChange={(v) =>
                  setProfile({ ...profile, goal: v })
                }
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose_weight">Lose Weight</SelectItem>
                  <SelectItem value="build_muscle">Build Muscle</SelectItem>
                  <SelectItem value="stay_fit">Stay Fit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select
                value={profile.activityLevel}
                onValueChange={(v) =>
                  setProfile({ ...profile, activityLevel: v })
                }
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.2">
                    Sedentary (little/no exercise)
                  </SelectItem>
                  <SelectItem value="1.375">
                    Lightly active (1–3 days/week)
                  </SelectItem>
                  <SelectItem value="1.55">
                    Moderately active (3–5 days/week)
                  </SelectItem>
                  <SelectItem value="1.725">
                    Very active (6–7 days/week)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dailyCalories && (
              <div className="mt-6 space-y-4">
                <div className="p-6 rounded-xl bg-primary/10 border border-primary/20 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">
                    Recommended Daily Intake
                  </p>
                  <h3 className="text-4xl font-display font-black text-primary mb-3">
                    {dailyCalories} kcal
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Based on: {profile.age} years, {profile.weight}kg, {profile.height}cm, {profile.activityLevel === "1.2" ? "Sedentary" : profile.activityLevel === "1.375" ? "Lightly Active" : profile.activityLevel === "1.55" ? "Moderately Active" : "Very Active"}
                  </p>
                </div>
                
                {macros && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                      <p className="text-xs text-blue-400 uppercase tracking-wider font-bold mb-1">Protein</p>
                      <p className="text-xl font-black text-blue-400">{macros.proteinGrams}g</p>
                    </div>
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                      <p className="text-xs text-green-400 uppercase tracking-wider font-bold mb-1">Carbs</p>
                      <p className="text-xl font-black text-green-400">{macros.carbsGrams}g</p>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                      <p className="text-xs text-yellow-400 uppercase tracking-wider font-bold mb-1">Fats</p>
                      <p className="text-xl font-black text-yellow-400">{macros.fatsGrams}g</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SAVE */}
        <Button
          onClick={handleSave}
          className="w-full h-12 text-lg font-bold gap-2 shadow-lg shadow-primary/20"
        >
          <Save className="h-5 w-5" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
