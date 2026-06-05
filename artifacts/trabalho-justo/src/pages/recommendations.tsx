import { useState } from "react";
import { Link } from "wouter";
import { useGetRecommendations, useListResumes } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, BookOpen, Sparkles, MapPin, DollarSign, Clock, GraduationCap, FileText } from "lucide-react";

export default function RecommendationsPage() {
  const { data: resumes } = useListResumes();
  const [selectedResume, setSelectedResume] = useState<string>("all");

  const curriculoId = selectedResume !== "all" ? parseInt(selectedResume, 10) : undefined;
  const { data: recommendations, isLoading } = useGetRecommendations(
    curriculoId !== undefined ? { curriculoId } : {}
  );

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "A combinar";
    if (min && max) return `R$ ${min.toLocaleString("pt-BR")} — R$ ${max.toLocaleString("pt-BR")}`;
    if (min) return `A partir de R$ ${min.toLocaleString("pt-BR")}`;
    return `Ate R$ ${max!.toLocaleString("pt-BR")}`;
  };

  const typeLabels: Record<string, string> = { clt: "CLT", pj: "PJ", freelance: "Freelance", estagio: "Estagio" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          Recomendacoes para Voce
        </h1>
        <p className="text-muted-foreground mt-1">
          Vagas e cursos selecionados com base nas habilidades do seu curriculo.
        </p>
      </div>

      {/* Seletor de curriculo */}
      <div className="flex items-center gap-3 bg-muted/40 rounded-lg p-4">
        <FileText className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Personalizar por curriculo</p>
          <p className="text-xs text-muted-foreground">Selecione um curriculo para ver recomendacoes personalizadas</p>
        </div>
        <Select value={selectedResume} onValueChange={setSelectedResume}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Selecione um curriculo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as recomendacoes</SelectItem>
            {resumes?.map((r) => (
              <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(!resumes || resumes.length === 0) && (
          <Button asChild size="sm" variant="outline">
            <Link href="/curriculos/novo">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Criar Curriculo
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Vagas recomendadas */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Vagas Recomendadas
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/vagas">Ver todas as vagas</Link>
              </Button>
            </div>
            {recommendations?.jobs && recommendations.jobs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.jobs.map((job) => {
                  const skills: string[] = (() => { try { return JSON.parse(job.skills); } catch { return []; } })();
                  return (
                    <Card key={job.id} className="flex flex-col hover:shadow-md transition-shadow border-l-4 border-l-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base leading-tight">{job.title}</CardTitle>
                        <CardDescription>{job.company}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-2">
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{formatSalary(job.salaryMin, job.salaryMax)}</span>
                        </div>
                        <Badge className="text-xs">{typeLabels[job.type] || job.type}</Badge>
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {skills.slice(0, 3).map((s, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        )}
                        <Button asChild size="sm" className="w-full mt-1">
                          <Link href={`/vagas/${job.id}`}>Ver Vaga</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Nenhuma vaga disponivel no momento.</p>
            )}
          </section>

          {/* Cursos recomendados */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Cursos para se Qualificar
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/cursos">Ver todos os cursos</Link>
              </Button>
            </div>
            {recommendations?.courses && recommendations.courses.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.courses.map((course) => {
                  const skills: string[] = (() => { try { return JSON.parse(course.skills); } catch { return []; } })();
                  return (
                    <Card key={course.id} className="flex flex-col hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base leading-tight">{course.title}</CardTitle>
                          <Badge className={`text-xs shrink-0 ${course.isFree === "true" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                            {course.isFree === "true" ? "Gratuito" : "Pago"}
                          </Badge>
                        </div>
                        <CardDescription>{course.provider}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-2">
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{course.area}</span>
                          {course.durationHours && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.durationHours}h</span>}
                        </div>
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {skills.slice(0, 3).map((s, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        )}
                        <Button asChild size="sm" className="w-full mt-1">
                          <Link href={`/cursos/${course.id}`}>Ver Curso</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Nenhum curso disponivel no momento.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
