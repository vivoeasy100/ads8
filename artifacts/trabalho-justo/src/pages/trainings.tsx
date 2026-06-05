import { useParams, Link } from "wouter";
import { 
  useGetCompany, 
  useListTrainings, 
  useCreateTraining, 
  useUpdateTraining, 
  useDeleteTraining,
  getGetCompanyQueryKey,
  getListTrainingsQueryKey
} from "@workspace/api-client-react";
import type { Training, CreateTrainingBody } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, BookOpen, Trash2, Edit, ChevronRight, Clock, Users as UsersIcon, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const trainingSchema = z.object({
  title: z.string().min(2, "Título deve ter no mínimo 2 caracteres"),
  type: z.enum(["tecnico", "seguranca", "lideranca", "diversidade", "saude", "outros"]),
  hoursTotal: z.coerce.number().min(1, "A carga horária deve ser maior que 0"),
  participantsCount: z.coerce.number().min(1, "O número de participantes deve ser maior que 0"),
  completedAt: z.string().optional().nullable(),
});

type TrainingFormValues = z.infer<typeof trainingSchema>;

function TrainingFormDialog({ 
  companyId,
  training, 
  open, 
  onOpenChange 
}: { 
  companyId: number;
  training?: Training; 
  open: boolean; 
  onOpenChange: (o: boolean) => void 
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingSchema),
    defaultValues: training ? {
      title: training.title,
      type: training.type,
      hoursTotal: training.hoursTotal,
      participantsCount: training.participantsCount,
      completedAt: training.completedAt ? training.completedAt.split('T')[0] : null,
    } : {
      title: "",
      type: "tecnico",
      hoursTotal: 1,
      participantsCount: 1,
      completedAt: null,
    },
  });

  const createMutation = useCreateTraining();
  const updateMutation = useUpdateTraining();

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(data: TrainingFormValues) {
    const payload = {
      ...data,
      completedAt: data.completedAt ? new Date(data.completedAt).toISOString() : null,
    };

    if (training) {
      updateMutation.mutate(
        { companyId, id: training.id, data: payload as CreateTrainingBody },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListTrainingsQueryKey(companyId) });
            toast({ title: "Treinamento atualizado com sucesso!" });
            onOpenChange(false);
          },
          onError: () => {
            toast({ title: "Erro ao atualizar treinamento", variant: "destructive" });
          }
        }
      );
    } else {
      createMutation.mutate(
        { companyId, data: payload as CreateTrainingBody },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListTrainingsQueryKey(companyId) });
            toast({ title: "Treinamento cadastrado com sucesso!" });
            form.reset();
            onOpenChange(false);
          },
          onError: () => {
            toast({ title: "Erro ao cadastrar treinamento", variant: "destructive" });
          }
        }
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{training ? "Editar Treinamento" : "Registrar Novo Treinamento"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Treinamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Segurança no Trabalho (NR-10)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tecnico">Técnico/Operacional</SelectItem>
                      <SelectItem value="seguranca">Segurança (NRs)</SelectItem>
                      <SelectItem value="lideranca">Liderança/Gestão</SelectItem>
                      <SelectItem value="diversidade">Diversidade e Inclusão</SelectItem>
                      <SelectItem value="saude">Saúde Mental/Física</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hoursTotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carga Horária Total</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="participantsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participantes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="completedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Conclusão (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <CardDescription>Deixe em branco se estiver em andamento.</CardDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function TrainingsPage() {
  const { id } = useParams<{ id: string }>();
  const companyId = parseInt(id, 10);

  const { data: company, isLoading: loadingCompany } = useGetCompany(companyId, {
    query: { enabled: !!companyId, queryKey: getGetCompanyQueryKey(companyId) }
  });

  const { data: trainings, isLoading, error } = useListTrainings(companyId, {
    query: { enabled: !!companyId, queryKey: getListTrainingsQueryKey(companyId) }
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editTraining, setEditTraining] = useState<Training | undefined>(undefined);
  const deleteMutation = useDeleteTraining();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (trainingId: number) => {
    deleteMutation.mutate(
      { companyId, id: trainingId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTrainingsQueryKey(companyId) });
          toast({ title: "Treinamento removido com sucesso." });
        },
        onError: () => {
          toast({ title: "Erro ao remover treinamento.", variant: "destructive" });
        }
      }
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "seguranca": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "diversidade": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "saude": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "lideranca": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      default: return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/empresas"><span className="hover:text-primary cursor-pointer transition-colors">Empresas</span></Link>
            <ChevronRight className="h-4 w-4" />
            {loadingCompany ? <Skeleton className="h-4 w-24" /> : (
              <>
                <Link href={`/empresas/${companyId}`}><span className="hover:text-primary cursor-pointer transition-colors">{company?.name}</span></Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">Treinamentos</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <BookOpen className="h-8 w-8" />
            Programas de Capacitação
          </h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe o desenvolvimento profissional e as horas de treinamento ofertadas.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Treinamento
        </Button>
      </div>

      <TrainingFormDialog 
        companyId={companyId}
        open={createOpen} 
        onOpenChange={setCreateOpen} 
      />
      
      {editTraining && (
        <TrainingFormDialog 
          companyId={companyId}
          training={editTraining}
          open={!!editTraining} 
          onOpenChange={(open) => !open && setEditTraining(undefined)} 
        />
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro</CardTitle>
            <CardDescription>Não foi possível carregar os treinamentos.</CardDescription>
          </CardHeader>
        </Card>
      ) : !trainings || trainings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/50">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">Nenhum treinamento registrado</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-4">
            Registre os cursos e programas de capacitação oferecidos aos funcionários da empresa.
          </p>
          <Button variant="outline" onClick={() => setCreateOpen(true)}>
            Registrar Treinamento
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trainings.map((training, index) => (
            <Card key={training.id} className={`animate-in fade-in slide-in-from-bottom-4 group hover:border-primary/50 transition-colors ${training.completedAt ? "bg-card" : "bg-primary/5 border-primary/20"}`} style={{ animationDelay: `${index * 50}ms` }}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`capitalize border-none ${getTypeColor(training.type)}`}>
                    {training.type}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditTraining(training)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover treinamento?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. As horas de capacitação serão removidas do cálculo do índice ODS 8.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(training.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardTitle className="mt-4 line-clamp-2 text-lg leading-tight" title={training.title}>
                  {training.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 space-y-3">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    {training.participantsCount} part.
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {training.hoursTotal}h
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-2 border-t">
                  {training.completedAt ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      Concluído em {new Date(training.completedAt).toLocaleDateString('pt-BR')}
                    </>
                  ) : (
                    <>
                      <Activity className="h-3.5 w-3.5 text-primary" />
                      Em andamento
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
