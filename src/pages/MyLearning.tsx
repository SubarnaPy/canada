import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, GraduationCap, Download, PlayCircle, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Ebook {
  id: string;
  title: string;
  description: string;
  cover_image: string | null;
  pdf_url: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
}

export default function MyLearning() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [myEbooks, setMyEbooks] = useState<Ebook[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
    await fetchUserPurchases(session.user.id);
  };

  const fetchUserPurchases = async (userId: string) => {
    try {
      const { data: purchases, error: purchasesError } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", userId);

      if (purchasesError) throw purchasesError;

      const ebookIds = purchases?.filter(p => p.item_type === "ebook").map(p => p.item_id) || [];
      const courseIds = purchases?.filter(p => p.item_type === "course").map(p => p.item_id) || [];

      if (ebookIds.length > 0) {
        const { data: ebooks, error: ebooksError } = await supabase
          .from("ebooks")
          .select("*")
          .in("id", ebookIds);

        if (ebooksError) throw ebooksError;
        setMyEbooks(ebooks || []);
      }

      if (courseIds.length > 0) {
        const { data: courses, error: coursesError } = await supabase
          .from("courses")
          .select("*")
          .in("id", courseIds);

        if (coursesError) throw coursesError;
        setMyCourses(courses || []);
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
      toast({
        title: "Error",
        description: "Failed to load your learning materials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadEbook = (ebook: Ebook) => {
    const { data } = supabase.storage
      .from("ebook-files")
      .getPublicUrl(ebook.pdf_url);

    window.open(data.publicUrl, "_blank");
    toast({
      title: "Download Started",
      description: "Your e-book download has started",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="container px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Learning</h1>
            <p className="text-muted-foreground">
              Access all your e-books and courses in one place
            </p>
          </div>

          <Tabs defaultValue="ebooks" className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="ebooks" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                My E-Books
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                My Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ebooks" className="space-y-6">
              {myEbooks.length === 0 ? (
                <Card className="p-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No E-Books Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your library with our expert guides
                  </p>
                  <Button onClick={() => navigate("/ebooks")}>
                    Browse E-Books
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myEbooks.map((ebook) => (
                    <Card key={ebook.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-[4/5] overflow-hidden bg-muted">
                        {ebook.cover_image ? (
                          <img
                            src={ebook.cover_image}
                            alt={ebook.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">
                            {ebook.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {ebook.description}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleDownloadEbook(ebook)}
                          className="w-full"
                          variant="outline"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              {myCourses.length === 0 ? (
                <Card className="p-12 text-center">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Courses Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start learning with our expert-led video courses
                  </p>
                  <Button onClick={() => navigate("/courses")}>
                    Browse Courses
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6">
                  {myCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row gap-6 p-6">
                        <div className="md:w-64 aspect-video overflow-hidden rounded-lg bg-muted flex-shrink-0">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <GraduationCap className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="font-bold text-xl mb-2">{course.title}</h3>
                            <p className="text-muted-foreground">{course.description}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold">0%</span>
                            </div>
                            <Progress value={0} />
                          </div>
                          <div className="flex gap-3">
                            <Button onClick={() => navigate(`/courses/${course.id}`)}>
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Continue Learning
                            </Button>
                            <Button variant="outline">
                              <FileText className="h-4 w-4 mr-2" />
                              Resources
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
