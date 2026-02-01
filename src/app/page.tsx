import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col auth-bg">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center pt-20">
        <div className="container animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 text-gradient">
            ScholarSource
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your premium gateway to academic excellence. Access top-tier semesters, subjects, and study materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard">
                <Button className="w-full sm:w-auto h-12 px-8 text-lg rounded-full shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_40px_rgba(124,58,237,0.7)] transition-shadow">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/browse">
                  <Button className="w-full sm:w-auto h-12 px-8 text-lg rounded-full shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_40px_rgba(124,58,237,0.7)] transition-shadow">
                    Explore Content
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-lg rounded-full">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce text-muted-foreground">
          <span className="text-sm">Scroll Down</span>
          <div className="w-px h-12 bg-white/20 mx-auto mt-2"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-black/20" id="features">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  🚀
                </div>
                <CardTitle className="text-xl">Premium Content</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Best question banks and their solutions included with practical documents and notes created by 10 pointers and toppers
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
                  🔒
                </div>
                <CardTitle className="text-xl">Secure Access</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                State-of-the-art secure viewer technology ensuring your content remains exclusive.
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                  ⚡
                </div>
                <CardTitle className="text-xl">Instant Availability</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Get immediate access to your purchased semesters. No waiting, just learning.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black/40 text-center text-muted-foreground">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} ScholarSource. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
