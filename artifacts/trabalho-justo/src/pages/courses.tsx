import { useState } from "react";
import { Link } from "wouter";
import { useListCourses } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, Search, GraduationCap, Star } from "lucide-react";

const levelColors: Record<string, string> = {
  iniciante: "bg-green-100 text-green-800",
  intermediario: "bg-yellow-100 text-yellow-800",
  avancado: "bg-red-100 text-red-800",
};

const levelLabels: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediario",
  avancado: "Avancado",
};

export default function CoursesPage() {
  const { data: courses, isLoading } = useListCourses();
  const [search, setSearch] = useState("");
  const [freeFilter, setFreeFilter] = useState("todos");
  const [areaFilter, setAreaFilter] = useState("todas");

  const areas = courses ? ["todas", ...Array.from(new Set(courses.map((c) => c.area)))] : ["todas"];

  const filtered = courses?.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.area.toLowerCase().includes(q);
    const matchFree = freeFilter === "todos" || (freeFilter === "gratuitos" ? c.isFree === "true" : c.isFree === "false");
    const matchArea = areaFilter === "todas" || c.area === areaFilter;
    return matchSearch && matchFree && matchArea;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cursos de Capacitacao</h1>
        <p className="text-muted-foreground mt-1">
          Qualificacao profissional alinhada as demandas do mercado formal e aos indicadores ODS 8.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por curso, instituicao ou habilidade..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["todos", "gratuitos", "pagos"].map((f) => (
            <Button
              key={f}
              size="sm"
              variant={freeFilter === f ? "default" : "outline"}
              onClick={() => setFreeFilter(f)}
              className="capitalize"
            >
              {f === "todos" ? "Todos" : f === "gratuitos" ? "Gratuitos" : "Pagos"}
            </Button>
          ))}
          <div className="w-px bg-border mx-1" />
          {!isLoading && areas.map((area) => (
            <Button
              key={area}
              size="sm"
              variant={areaFilter === area ? "default" : "outline"}
              onClick={() => setAreaFilter(area)}
            >
              {area === "todas" ? "Todas as areas" : area}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "curso encontrado" : "cursos encontrados"}
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => {
              const skills: string[] = (() => { try { return JSON.parse(course.skills); } catch { return []; } })();
              return (
                <Card key={course.id} className="flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <Badge className={`text-xs ${course.isFree === "true" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                        {course.isFree === "true" ? "Gratuito" : "Pago"}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm leading-tight mt-2">{course.title}</CardTitle>
                    <CardDescription className="text-xs">{course.provider}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2 pb-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        {course.area}
                      </span>
                      {course.durationHours && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.durationHours}h
                        </span>
                      )}
                    </div>
                    <Badge className={`text-xs ${levelColors[course.level] || "bg-gray-100 text-gray-700"}`}>
                      {levelLabels[course.level] || course.level}
                    </Badge>
                    <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 3).map((s, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                        {skills.length > 3 && <Badge variant="outline" className="text-xs">+{skills.length - 3}</Badge>}
                      </div>
                    )}
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/cursos/${course.id}`}>Ver Curso</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium">Nenhum curso encontrado</h3>
          <p className="text-muted-foreground mt-1">Tente ajustar os filtros.</p>
        </div>
      )}
    </div>
  );
}
