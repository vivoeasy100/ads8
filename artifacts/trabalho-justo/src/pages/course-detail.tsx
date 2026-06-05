import { useParams, Link } from "wouter";
import { useGetCourse } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, GraduationCap, Star, ExternalLink, BookOpen, Briefcase } from "lucide-react";

const levelLabels: Record<string, string> = {
  iniciante: "Iniciante", intermediario: "Intermediario", avancado: "Avancado",
};

const levelColors: Record<string, string> = {
  iniciante: "bg-green-100 text-green-800",
  intermediario: "bg-yellow-100 text-yellow-800",
  avancado: "bg-red-100 text-red-800",
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id, 10);
  const { data: course, isLoading } = useGetCourse(courseId);

  const parseJson = (str: string): string[] => {
    try { return JSON.parse(str); } catch { return []; }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Curso nao encontrado</h2>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/cursos"><ArrowLeft className="h-4 w-4 mr-2" />Voltar para Cursos</Link>
        </Button>
      </div>
    );
  }

  const skills = parseJson(course.skills);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/cursos"><ArrowLeft className="h-4 w-4 mr-2" />Todos os Cursos</Link>
      </Button>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold leading-tight">{course.title}</h1>
              <p className="text-muted-foreground mt-0.5">{course.provider}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className={levelColors[course.level] || "bg-gray-100 text-gray-700"}>
              {levelLabels[course.level] || course.level}
            </Badge>
            <Badge className={course.isFree === "true" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}>
              {course.isFree === "true" ? "Gratuito" : "Pago"}
            </Badge>
            <Badge variant="outline">
              <GraduationCap className="h-3 w-3 mr-1" />
              {course.area}
            </Badge>
            {course.durationHours && (
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {course.durationHours} horas
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <h2 className="font-semibold mb-2">Sobre o Curso</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
          </div>

          {skills.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Habilidades que voce vai desenvolver
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <Badge key={i} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground">
                Este curso e indicado para quem busca crescimento profissional e empregabilidade no mercado formal.
              </p>
            </div>
            <div className="flex gap-2">
              {course.url && (
                <Button asChild>
                  <a href={course.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Acessar Curso
                  </a>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/vagas">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Ver Vagas
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
