import { useState } from "react";
import { Link } from "wouter";
import { useListJobs } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, MapPin, DollarSign, Search, Clock, Building2 } from "lucide-react";

const typeLabels: Record<string, string> = {
  clt: "CLT",
  pj: "PJ",
  freelance: "Freelance",
  estagio: "Estagio",
  temporario: "Temporario",
};

const typeColors: Record<string, string> = {
  clt: "bg-green-100 text-green-800",
  pj: "bg-blue-100 text-blue-800",
  freelance: "bg-purple-100 text-purple-800",
  estagio: "bg-orange-100 text-orange-800",
  temporario: "bg-yellow-100 text-yellow-800",
};

export default function JobsPage() {
  const { data: jobs, isLoading } = useListJobs();
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("todas");

  const areas = jobs ? ["todas", ...Array.from(new Set(jobs.map((j) => j.area)))] : ["todas"];

  const filtered = jobs?.filter((job) => {
    const q = search.toLowerCase();
    const matchSearch = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q) || job.area.toLowerCase().includes(q);
    const matchArea = areaFilter === "todas" || job.area === areaFilter;
    return matchSearch && matchArea;
  });

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "A combinar";
    if (min && max) return `R$ ${min.toLocaleString("pt-BR")} - R$ ${max.toLocaleString("pt-BR")}`;
    if (min) return `A partir de R$ ${min.toLocaleString("pt-BR")}`;
    return `Ate R$ ${max!.toLocaleString("pt-BR")}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vagas de Emprego</h1>
        <p className="text-muted-foreground mt-1">
          Oportunidades em empresas comprometidas com o trabalho decente e os ODS 8.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cargo, empresa ou area..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : (
            areas.map((area) => (
              <Button
                key={area}
                size="sm"
                variant={areaFilter === area ? "default" : "outline"}
                onClick={() => setAreaFilter(area)}
                className="capitalize"
              >
                {area === "todas" ? "Todas as areas" : area}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* Resultados */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-52" />)}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "vaga encontrada" : "vagas encontradas"}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((job) => {
              const skills: string[] = (() => { try { return JSON.parse(job.skills); } catch { return []; } })();
              return (
                <Card key={job.id} className="flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base leading-tight">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Building2 className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{job.company}</span>
                        </CardDescription>
                      </div>
                      <Badge className={`text-xs shrink-0 ${typeColors[job.type] || "bg-gray-100 text-gray-800"}`}>
                        {typeLabels[job.type] || job.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2.5">
                    <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 shrink-0" />
                        <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 shrink-0" />
                        <span>{job.area}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{job.description}</p>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 4).map((s, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                        {skills.length > 4 && <Badge variant="outline" className="text-xs">+{skills.length - 4}</Badge>}
                      </div>
                    )}
                    <Button asChild size="sm" className="w-full mt-1">
                      <Link href={`/vagas/${job.id}`}>Ver Vaga Completa</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium">Nenhuma vaga encontrada</h3>
          <p className="text-muted-foreground mt-1">Tente ajustar os filtros de busca.</p>
        </div>
      )}
    </div>
  );
}
