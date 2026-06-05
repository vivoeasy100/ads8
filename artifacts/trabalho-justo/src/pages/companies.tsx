import { useListCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany, getListCompaniesQueryKey } from "@workspace/api-client-react";
import type { Company, CreateCompanyBody } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Building2, MapPin, Briefcase, Trash2, Edit, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const companySchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  sector: z.string().min(2, "Setor deve ter no mínimo 2 caracteres"),
  size: z.enum(["micro", "pequena", "media", "grande"]),
  city: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres"),
  state: z.string().length(2, "Estado deve ter 2 caracteres (ex: SP)"),
});

type CompanyFormValues = z.infer<typeof companySchema>;

function CompanyFormDialog({ 
  company, 
  open, 
  onOpenChange 
}: { 
  company?: Company; 
  open: boolean; 
  onOpenChange: (o: boolean) => void 
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: company ? {
      name: company.name,
      sector: company.sector,
      size: company.size,
      city: company.city,
      state: company.state,
    } : {
      name: "",
      sector: "",
      size: "micro",
      city: "",
      state: "",
    },
  });

  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(data: CompanyFormValues) {
    if (company) {
      updateMutation.mutate(
        { id: company.id, data: data as CreateCompanyBody },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey() });
            toast({ title: "Empresa atualizada com sucesso!" });
            onOpenChange(false);
          },
          onError: () => {
            toast({ title: "Erro ao atualizar empresa", variant: "destructive" });
          }
        }
      );
    } else {
      createMutation.mutate(
        { data: data as CreateCompanyBody },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey() });
            toast({ title: "Empresa cadastrada com sucesso!" });
            form.reset();
            onOpenChange(false);
          },
          onError: () => {
            toast({ title: "Erro ao cadastrar empresa", variant: "destructive" });
          }
        }
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{company ? "Editar Empresa" : "Cadastrar Nova Empresa"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setor</FormLabel>
                    <FormControl>
                      <Input placeholder="Tecnologia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porte</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="micro">Micro</SelectItem>
                        <SelectItem value="pequena">Pequena</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="grande">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="SP" maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

export default function CompaniesPage() {
  const { data: companies, isLoading, error } = useListCompanies();
  const [createOpen, setCreateOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | undefined>(undefined);
  const deleteMutation = useDeleteCompany();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey() });
          toast({ title: "Empresa removida com sucesso." });
        },
        onError: () => {
          toast({ title: "Erro ao remover empresa.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Empresas Monitoradas</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas e acompanhe o alinhamento com o Trabalho Decente.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      <CompanyFormDialog 
        open={createOpen} 
        onOpenChange={setCreateOpen} 
      />
      
      {editCompany && (
        <CompanyFormDialog 
          company={editCompany}
          open={!!editCompany} 
          onOpenChange={(open) => !open && setEditCompany(undefined)} 
        />
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro</CardTitle>
            <CardDescription>Não foi possível carregar a lista de empresas.</CardDescription>
          </CardHeader>
        </Card>
      ) : !companies || companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/50">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">Nenhuma empresa cadastrada</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-4">
            Comece adicionando sua primeira empresa para monitorar os indicadores do ODS 8.
          </p>
          <Button variant="outline" onClick={() => setCreateOpen(true)}>
            Adicionar Empresa
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, index) => (
            <Card key={company.id} className="animate-in fade-in slide-in-from-bottom-4 group hover:border-primary/50 transition-colors" style={{ animationDelay: `${index * 50}ms` }}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditCompany(company)}>
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
                          <AlertDialogTitle>Remover empresa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Todos os dados, indicadores e funcionários da empresa {company.name} serão removidos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(company.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardTitle className="mt-4 line-clamp-1" title={company.name}>{company.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {company.city}, {company.state}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span className="capitalize">{company.sector}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="capitalize">Porte {company.size}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/empresas/${company.id}`} className="w-full">
                  <Button className="w-full variant-outline hover:bg-primary hover:text-primary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    Ver Detalhes
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
