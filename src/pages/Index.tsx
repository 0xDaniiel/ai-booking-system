import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Sparkles, Clock, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Scheduling
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-primary">
            Smart Appointment Booking Made Simple
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Schedule meetings effortlessly with AI assistance. Say goodbye to
            back-and-forth emails and let our intelligent system find the
            perfect time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg shadow-glow hover:shadow-lg transition-all"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/book")}
              className="text-lg"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Quick Book
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose BookingAI?
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful features designed to make scheduling effortless
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-all border-border/50">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>AI-Powered Scheduling</CardTitle>
              <CardDescription>
                Natural language booking that understands your requests and
                finds optimal times
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all border-border/50">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-accent-foreground" />
              </div>
              <CardTitle>Real-Time Availability</CardTitle>
              <CardDescription>
                Sync your calendar and show only available time slots to
                eliminate conflicts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all border-border/50">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Instant Confirmations</CardTitle>
              <CardDescription>
                Automatic notifications and reminders keep everyone on the same
                page
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-primary text-primary-foreground shadow-glow max-w-4xl mx-auto">
          <CardHeader className="text-center py-12">
            <CardTitle className="text-3xl md:text-4xl mb-4">
              Ready to Transform Your Scheduling?
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg mb-6">
              Join thousands of professionals who save time with AI-powered
              booking
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/auth")}
                className="text-lg"
              >
                Start Free Trial
              </Button>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} BookingAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
