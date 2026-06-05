import { useParams, Link } from "wouter";
import { useGetJob, useGetRecommendations } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, MapPin, DollarSign, Briefcase, Building2,
  CheckCircle2, Clock, GraduationCap, Star, BookOpen
} from "lucide-react";

const typeLabels: Record<string, string> = {
  clt: "CLT", pj: "PJ", freelance: "Freelance", estagio: "Estagio", temporario: "Temporario",
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id, 10);
  const { data: job, isLoading } = useGetJob(jobId);
  const { data: recommendations } = useGetRecommendations({ curriculoId: undefined });

  const relatedCourses = recommendations?.courses.slice(0, 3) ?? [];

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "A combinar";
    if (min && max) return `R$ ${min.toLocaleString("pt-BR")} - R$ ${max.toLocaleString("pt-BR")}`;
    if (min) return `A partir de R$ ${min.toLocaleString("pt-BR")}`;
    return `Ate R$ ${max!.toLocaleString("pt-BR")}`;
  };

  const parseJson = (str: string): string[] => {
    try { return JSON.parse(str); } catch { return []; }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Vaga nao encontrada</h2>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/vagas"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Vagas</Link>
        </Button>
      </div>
    );
  }

  const requirements = parseJson(job.requirements);
  const skills = parseJson(job.skills);
  const benefits = parseJson(job.benefits);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/vagas"><ArrowLeft className="h-4 w-4 mr-2" /> Todas as Vagas</Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">{job.company}</span>
              </div>
            </div>
            <Badge className="text-sm px-3 py-1">{typeLabels[job.type] || job.type}</Badge>
          </div>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{job.location}</span>
            <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" />{formatSalary(job.salaryMin, job.salaryMax)}</span>
            <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" />{job.area}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="font-semibold text-base mb-2">Sobre a Vaga</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          <Separator />

          {requirements.length > 0 && (
            <div>
              <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Requisitos
              </h2>
              <ul className="space-y-1.5">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                Habilidades Desejadas
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <Badge key={i} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>
          )}

          {benefits.length > 0 && (
            <div>
              <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Beneficios
              </h2>
              <div className="grid grid-cols-2 gap-1.5">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Esta vaga faz parte do programa TrabalhoJusto ODS 8 — emprego formal e digno.
            </p>
            <Button asChild>
              <Link href="/curriculos/novo">Candidatar com Curriculo</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {relatedCourses.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Cursos para se preparar para esta vaga
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {relatedCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm leading-tight">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{course.provider}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant={course.isFree === "true" ? "default" : "outline"} className="text-xs">
                      {course.isFree === "true" ? "Gratuito" : "Pago"}
                    </Badge>
                    <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                      <Link href={`/cursos/${course.id}`}>Ver curso</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
