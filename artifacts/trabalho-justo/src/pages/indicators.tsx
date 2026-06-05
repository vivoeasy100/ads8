import { useParams, Link } from "wouter";
import { 
  useGetCompany, 
  useListIndicators, 
  useCreateIndicator, 
  useUpdateIndicator, 
  useDeleteIndicator,
  getGetCompanyQueryKey,
  getListIndicatorsQueryKey
} from "@workspace/api-client-react";
import type { Indicator, CreateIndicatorBody } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Activity, Trash2, Edit, ChevronRight, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const indicatorSchema = z.object({
  category: z.enum([
    "salario", "jornada", "rotatividade", "saude_seguranca", 
    "diversidade", "capacitacao", "trabalho_infantil", "formalidade"
  ]),
  value: z.coerce.number({ invalid_type_error: "Valor inválido" }),
  unit: z.string().min(1, "Unidade é obrigatória"),
  period: z.string().min(1, "Período é obrigatório (ex: 2024-Q1)"),
  notes: z.string().optional().nullable(),
});

type IndicatorFormValues = z.infer<typeof indicatorSchema>;

function IndicatorFormDialog({ 
  companyId,
  indicator, 
  open, 
  onOpenChange 
}: { 
  companyId: number;
  indicator?: Indicator; 
  open: boolean; 
  onOpenChange: (o: boolean) => void 
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<IndicatorFormValues>({
    resolver: zodResolver(indicatorSchema),
    defaultValues: indicator ? {
      category: indicator.category,
      value: indicator.value,
      unit: indicator.unit,
      period: indicator.period,
      notes: indicator.notes,
    } : {
      category: "salario",
      value: 0,
      unit: "",
      period: "",
      notes: "",
    },
  });

  const createMutation = useCreateIndicator();
  const updateMutation = useUpdateIndicator();

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(data: IndicatorFormValues) {
    if (indicator) {
      updateMutation.mutate(
        { companyId, id: indicator.id, data: data as CreateIndicatorBody },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListIndicatorsQueryKey(companyId) });
            toast({ title: "Indicador atualizado com sucesso!" });
            onOpenChange(false);
          },
          onError: () => {
            toast({ title: "Erro ao atualizar indicador", variant: "destructive" });
          }
        }
      );
    } else {
      createMutation.mutate(
        { companyId, data: data as CreateIndicatorBody },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListIndicatorsQueryKey(companyId) });
            toast({ title: "Indicador cadastrado com sucesso!" });
            form.reset();
            onOpenChange(false);
          },
          onError: () => {
            toast({ title: "Erro ao cadastrar indicador", variant: "destructive" });
          }
        }
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{indicator ? "Editar Indicador" : "Registrar Novo Indicador"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="salario">Salário</SelectItem>
                      <SelectItem value="jornada">Jornada</SelectItem>
                      <SelectItem value="rotatividade">Rotatividade</SelectItem>
                      <SelectItem value="saude_seguranca">Saúde e Segurança</SelectItem>
                      <SelectItem value="diversidade">Diversidade</SelectItem>
                      <SelectItem value="capacitacao">Capacitação</SelectItem>
                      <SelectItem value="trabalho_infantil">Trabalho Infantil</SelectItem>
                      <SelectItem value="formalidade">Formalidade</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <FormControl>
                      <Input placeholder="%, horas, R$, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 2024-Q1 ou Jan/2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalhes opcionais sobre esta medição" {...field} value={field.value || ''} />
                  </FormControl>
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

export default function IndicatorsPage() {
  const { id } = useParams<{ id: string }>();
  const companyId = parseInt(id, 10);

  const { data: company, isLoading: loadingCompany } = useGetCompany(companyId, {
    query: { enabled: !!companyId, queryKey: getGetCompanyQueryKey(companyId) }
  });

  const { data: indicators, isLoading, error } = useListIndicators(companyId, {
    query: { enabled: !!companyId, queryKey: getListIndicatorsQueryKey(companyId) }
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editIndicator, setEditIndicator] = useState<Indicator | undefined>(undefined);
  const deleteMutation = useDeleteIndicator();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (indicatorId: number) => {
    deleteMutation.mutate(
      { companyId, id: indicatorId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListIndicatorsQueryKey(companyId) });
          toast({ title: "Indicador removido com sucesso." });
        },
        onError: () => {
          toast({ title: "Erro ao remover indicador.", variant: "destructive" });
        }
      }
    );
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      "salario": "Salário",
      "jornada": "Jornada de Trabalho",
      "rotatividade": "Rotatividade (Turnover)",
      "saude_seguranca": "Saúde e Segurança",
      "diversidade": "Diversidade",
      "capacitacao": "Capacitação",
      "trabalho_infantil": "Trabalho Infantil",
      "formalidade": "Formalidade"
    };
    return labels[category] || category;
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
                <span className="text-foreground font-medium">Indicadores</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <Activity className="h-8 w-8" />
            Gestão de Indicadores ODS 8
          </h1>
          <p className="text-muted-foreground mt-2">
            Registre as medições de práticas de trabalho para compor o índice geral.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Indicador
        </Button>
      </div>

      <IndicatorFormDialog 
        companyId={companyId}
        open={createOpen} 
        onOpenChange={setCreateOpen} 
      />
      
      {editIndicator && (
        <IndicatorFormDialog 
          companyId={companyId}
          indicator={editIndicator}
          open={!!editIndicator} 
          onOpenChange={(open) => !open && setEditIndicator(undefined)} 
        />
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro</CardTitle>
            <CardDescription>Não foi possível carregar os indicadores.</CardDescription>
          </CardHeader>
        </Card>
      ) : !indicators || indicators.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/50">
          <Activity className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">Nenhum indicador registrado</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-4">
            A empresa não possui indicadores ODS 8 registrados. Eles são necessários para o cálculo do score.
          </p>
          <Button variant="outline" onClick={() => setCreateOpen(true)}>
            Registrar Indicador
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {indicators.map((indicator, index) => (
            <Card key={indicator.id} className="animate-in fade-in slide-in-from-bottom-4 group hover:border-primary/50 transition-colors" style={{ animationDelay: `${index * 50}ms` }}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 px-2 py-1 rounded text-primary text-xs font-medium uppercase tracking-wider">
                    {getCategoryLabel(indicator.category)}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditIndicator(indicator)}>
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
                          <AlertDialogTitle>Remover indicador?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O valor do score da empresa pode ser impactado.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(indicator.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardTitle className="mt-4 text-2xl font-bold">
                  {indicator.value} <span className="text-sm font-normal text-muted-foreground">{indicator.unit}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Período: <span className="font-medium text-foreground">{indicator.period}</span>
                </CardDescription>
              </CardHeader>
              {indicator.notes && (
                <CardContent className="pt-0 pb-4 text-sm text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 opacity-50" />
                  <p className="line-clamp-2">{indicator.notes}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
