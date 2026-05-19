import Ecosystem from "./components/home/Ecosystem";
import Features from "./components/home/Features";
import Hero from "./components/home/Hero";
import Payments from "./components/home/Payments";
import WorkflowCards from "./components/home/Workflowcards";

export default function Page() {
  return (
    <main className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <Features />
      {/* Workflow Cards Section */}
      <WorkflowCards />
      {/* Ecosystem Section */}
      <Ecosystem />
      {/* Payments Section */}
      <Payments />
      {/* Bottom Spacing */}
      <div className="h-16 md:h-24"></div>
    </main>
  );
}
