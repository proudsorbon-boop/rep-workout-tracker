import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Dumbbell, BarChart, Sparkles } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Welcome to Rep",
    description: "Your minimalist journey to a stronger self starts here.",
    icon: Dumbbell,
    color: "text-primary",
  },
  {
    title: "Track with Ease",
    description: "Log your sets, reps, and weights in seconds. No clutter, just results.",
    icon: BarChart,
    color: "text-blue-500",
  },
  {
    title: "Reach Your Goals",
    description: "Follow expert plans or create your own. Stay consistent, stay motivated.",
    icon: Sparkles,
    color: "text-yellow-500",
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const Icon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-8">
      <div className="absolute top-8 right-8">
        <Button variant="ghost" onClick={onComplete} className="text-muted-foreground">
          Skip
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center max-w-sm"
        >
          <div className={`p-6 rounded-3xl bg-white/5 mb-8 ${steps[currentStep].color}`}>
            <Icon className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-display font-black mb-4 tracking-tight">
            {steps[currentStep].title}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {steps[currentStep].description}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentStep ? "w-8 bg-primary" : "w-2 bg-white/10"
            }`}
          />
        ))}
      </div>

      <Button
        onClick={next}
        className="mt-12 w-full max-w-sm h-14 text-lg font-bold rounded-2xl group shadow-lg shadow-primary/20"
      >
        {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
