import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Clock, BarChart3, PlayCircle, FileText, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  is_free: boolean;
  sales_count: number;
}

interface Lesson {
  id: string;
  title: string;
  lesson_order: number;
  video_url: string;
  resource_url: string | null;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const fetchCourseDetails = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      const { data: lessonsData, error: lessonsError } = await supabase
        .from("course_lessons")
        .select("*")
        .eq("course_id", id)
        .order("lesson_order");

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in this course",
      });
      navigate("/auth");
      return;
    }

    if (course?.is_free) {
      try {
        const { error } = await supabase.from("purchases").insert({
          user_id: user.id,
          item_id: course.id,
          item_type: "course",
          amount: 0,
        });

        if (error) throw error;

        toast({
          title: "Success!",
          description: "You've been enrolled in the course",
        });
        
        navigate("/my-learning");
      } catch (error) {
        console.error("Error enrolling:", error);
        toast({
          title: "Error",
          description: "Failed to enroll in course",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Coming Soon",
        description: "Payment integration coming soon!",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading course...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Course not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <section className="bg-gradient-card border-b border-border">
          <div className="container px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Course</Badge>
                    {course.is_free && <Badge className="bg-secondary">FREE</Badge>}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold">{course.title}</h1>
                  <p className="text-lg text-muted-foreground">{course.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span>{course.sales_count} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Self-paced learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>All levels</span>
                  </div>
                </div>
              </div>

              <Card className="p-6 h-fit sticky top-24">
                {course.thumbnail && (
                  <div className="aspect-video overflow-hidden rounded-lg mb-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    {course.is_free ? (
                      <p className="text-3xl font-bold text-secondary">FREE</p>
                    ) : (
                      <p className="text-3xl font-bold">${course.price}</p>
                    )}
                  </div>
                  <Button onClick={handleEnroll} className="w-full" size="lg">
                    Enroll Now
                  </Button>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Video lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Downloadable resources</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="container px-4 py-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Course Content</h2>
            <div className="space-y-3">
              {lessons.length === 0 ? (
                <p className="text-muted-foreground">No lessons available yet.</p>
              ) : (
                lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{lesson.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-5 w-5 text-muted-foreground" />
                      {lesson.resource_url && (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
