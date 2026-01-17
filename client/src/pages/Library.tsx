import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Info, Dumbbell } from "lucide-react";

const exercises = [
  {
    name: "Push Ups",
    target: "Chest, Triceps",
    description:
      "A classic bodyweight exercise for upper body strength.",
  },
  {
    name: "Squats",
    target: "Quads, Glutes",
    description:
      "The king of lower body exercises. Focus on form and depth.",
  },
  {
    name: "Plank",
    target: "Core",
    description:
      "Static hold to build abdominal strength and stability.",
  },
  {
    name: "Lunge",
    target: "Legs",
    description:
      "Great for balance and single-leg strength.",
  },
  {
    name: "Pull Ups",
    target: "Back, Biceps",
    description:
      "Challenging upper body pull exercise.",
  },
  {
    name: "Deadlift",
    target: "Back, Legs",
    description:
      "Compound movement for overall power.",
  },
  {
    name: "Shoulder Press",
    target: "Shoulders",
    description:
      "Build overhead strength and stability.",
  },
  {
    name: "Bicep Curls",
    target: "Biceps",
    description:
      "Isolation exercise for arm growth.",
  },
];

export default function Library() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return exercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        ex.target.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-background pb-32 p-4 max-w-md mx-auto">
      {/* HEADER */}
      <header className="pt-8 pb-6">
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-foreground">
          Exercise <span className="text-primary">Library</span>
        </h1>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises or muscles..."
            className="pl-10 bg-card border-white/5 h-12 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* LIST */}
      <div className="space-y-4">
        {filtered.map((ex, i) => (
          <Card
            key={i}
            role="button"
            tabIndex={0}
            className="bg-card border-white/5 hover:border-primary/30 hover:bg-card/80 transition-all active:scale-[0.99] cursor-pointer"
            onClick={() => {
              // future: open tutorial / modal
              console.log("Exercise selected:", ex.name);
            }}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Dumbbell className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {ex.name}
                  </CardTitle>
                </div>

                <Badge
                  variant="outline"
                  className="text-[10px] uppercase tracking-tight bg-primary/5 border-primary/20 text-primary"
                >
                  {ex.target}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                {ex.description}
              </CardDescription>

              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary/60">
                <Info className="h-3 w-3" />
                <span>Tutorial coming soon</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* EMPTY */}
        {filtered.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <Dumbbell className="h-12 w-12 mx-auto mb-4" />
            <p>No exercises found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
