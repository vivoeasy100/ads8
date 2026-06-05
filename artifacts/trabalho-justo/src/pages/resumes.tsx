import { Link } from "wouter";
import {
  useListResumes,
  useDeleteResume,
  getListResumesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText, Trash2, Edit, Mail, Phone, MapPin } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function ResumesPage() {
  const queryClient = useQueryClient();
  const { data: resumes, isLoading } = useListResumes();
  const deleteResume = useDeleteResume();

  const handleDelete = (id: number) => {
    deleteResume.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListResumesQueryKey() });
      },
    });
  };

  const parseSkills = (skillsJson: string): Array<{ name: string; level: string }> => {
    try {
      return JSON.parse(skillsJson) || [];
    } catch {
      return [];
    }
  };

  const parseExperiences = (expJson: string): Array<{ company: string; role: string }> => {
    try {
      return JSON.parse(expJson) || [];
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curriculos</h1>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie curriculos profissionais alinhados ao mercado de trabalho formal.
          </p>
        </div>
        <Button asChild>
          <Link href="/curriculos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Curriculo
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : resumes && resumes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => {
            const skills = parseSkills(resume.skills);
            const experiences = parseExperiences(resume.experiences);
            return (
              <Card key={resume.id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">{resume.name}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {resume.summary || "Sem resumo profissional"}
                      </CardDescription>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-2 pb-3">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{resume.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{resume.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{resume.city}, {resume.state}</span>
                  </div>
                  {experiences.length > 0 && (
                    <p className="text-xs text-muted-foreground pt-1">
                      {experiences.length} {experiences.length === 1 ? "experiencia" : "experiencias"} profissional{experiences.length !== 1 ? "is" : ""}
                    </p>
                  )}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {skills.slice(0, 3).map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{s.name}</Badge>
                      ))}
                      {skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{skills.length - 3}</Badge>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2 pt-0">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/curriculos/${resume.id}`}>
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Editar
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir curriculo?</AlertDialogTitle>
                        <AlertDialogDescription>
                          O curriculo de <strong>{resume.name}</strong> sera excluido permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(resume.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium">Nenhum curriculo criado</h3>
          <p className="text-muted-foreground mt-1 mb-6">
            Comece criando um curriculo profissional para um trabalhador.
          </p>
          <Button asChild>
            <Link href="/curriculos/novo">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Curriculo
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
