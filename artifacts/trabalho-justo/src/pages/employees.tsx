import { useParams, Link } from "wouter";
import { 
  useGetCompany, 
  useListEmployees, 
  useCreateEmployee, 
  useUpdateEmployee, 
  useDeleteEmployee,
  getGetCompanyQueryKey,
  getListEmployeesQueryKey
} from "@workspace/api-client-react";
import type { Employee, CreateEmployeeBody } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Trash2, Edit, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const employeeSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  role: z.string().min(2, "Cargo deve ter no mínimo 2 caracteres"),
  gender: z.enum(["masculino", "feminino", "outro", "nao_informado"]),
  age: z.coerce.number().min(14, "Idade mínima é 14").max(120, "Idade inválida"),
  salary: z.coerce.number().min(0, "Salário não pode ser negativo"),
  formalContract: z.boolean(),
  hiredAt: z.string().min(1, "Data de contratação é obrigatória"),
  dismissedAt: z.string().optional().nullable(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

function EmployeeFormDialog({ 
  companyId,
  employee, 
  open, 
  onOpenChange 
}: { 
  companyId: number;
  employee?: Employee; 
  open: boolean; 
  onOpenChange: (o: boolean) => void 
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee ? {
      name: employee.name,
      role: employee.role,
      gender: employee.gender,
      age: employee.age,
      salary: employee.salary,
      formalContract: employee.formalContract,
      hiredAt: employee.hiredAt.split('T')[0], // Extract just YYYY-MM-DD if ISO string
      dismissedAt: employee.dismissedAt ? employee.dismissedAt.split('T')[0] : null,
    } : {
      name: "",
      role: "",
      gender: "nao_informado",
      age: 25,
      salary: 0,
      formalContract: true,
      hiredAt: new Date().toISOString().split('T')[0],
      dismissedAt: null,
    },
  });

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(data: EmployeeFormValues) {
    // Format dates to ISO strings if needed, though the API might accept YYYY-MM-DD
    const payload = {
      ...data,
      hiredAt: new Date(data.hiredAt).toISOString(),
      dismissedAt: data.dismissedAt ? new Date(data.dismissedAt).toISOString() : null,
    };

    if (employee) {
      updateMutation.mutate(
        { companyId, id: employee.id, data: payload as CreateEmployeeBody },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListEmployeesQueryKey(companyId) });
            toast({ title: "Funcionário atualizado com sucesso!" });
            onOpenChange(false);
          },
          onError: () => {
            toast({ title: "Erro ao atualizar funcionário", variant: "destructive" });
          }
        }
      );
    } else {
      createMutation.mutate(
        { companyId, data: payload as CreateEmployeeBody },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListEmployeesQueryKey(companyId) });
            toast({ title: "Funcionário cadastrado com sucesso!" });
            form.reset();
            onOpenChange(false);
          },
          onError: () => {
            toast({ title: "Erro ao cadastrar funcionário", variant: "destructive" });
          }
        }
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{employee ? "Editar Funcionário" : "Cadastrar Novo Funcionário"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="João da Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input placeholder="Operador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salário (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="2500.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gênero</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                        <SelectItem value="nao_informado">Não Informado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hiredAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Admissão</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dismissedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Demissão</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="formalContract"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Contrato Formal (CLT)</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      O funcionário possui carteira assinada.
                    </p>
                  </div>
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

export default function EmployeesPage() {
  const { id } = useParams<{ id: string }>();
  const companyId = parseInt(id, 10);

  const { data: company, isLoading: loadingCompany } = useGetCompany(companyId, {
    query: { enabled: !!companyId, queryKey: getGetCompanyQueryKey(companyId) }
  });

  const { data: employees, isLoading, error } = useListEmployees(companyId, {
    query: { enabled: !!companyId, queryKey: getListEmployeesQueryKey(companyId) }
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | undefined>(undefined);
  const deleteMutation = useDeleteEmployee();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (employeeId: number) => {
    deleteMutation.mutate(
      { companyId, id: employeeId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListEmployeesQueryKey(companyId) });
          toast({ title: "Funcionário removido com sucesso." });
        },
        onError: () => {
          toast({ title: "Erro ao remover funcionário.", variant: "destructive" });
        }
      }
    );
  };

  const activeEmployees = employees?.filter(e => !e.dismissedAt) || [];
  const formalRate = activeEmployees.length > 0 
    ? (activeEmployees.filter(e => e.formalContract).length / activeEmployees.length) * 100 
    : 0;

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
                <span className="text-foreground font-medium">Funcionários</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <Users className="h-8 w-8" />
            Quadro de Funcionários
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as pessoas colaboradoras e acompanhe as taxas de formalidade.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Funcionário
        </Button>
      </div>

      {!isLoading && employees && employees.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-sm font-medium text-muted-foreground">Funcionários Ativos</p>
              <p className="text-4xl font-bold text-primary">{activeEmployees.length}</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-border"></div>
            <div className="space-y-1 text-center md:text-left">
              <p className="text-sm font-medium text-muted-foreground">Taxa de Formalidade</p>
              <p className="text-4xl font-bold text-primary">{formalRate.toFixed(1)}%</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-border"></div>
             <div className="space-y-1 text-center md:text-left">
              <p className="text-sm font-medium text-muted-foreground">Média Salarial</p>
              <p className="text-4xl font-bold text-primary">
                {activeEmployees.length > 0 
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      activeEmployees.reduce((acc, curr) => acc + curr.salary, 0) / activeEmployees.length
                    )
                  : "R$ 0,00"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <EmployeeFormDialog 
        companyId={companyId}
        open={createOpen} 
        onOpenChange={setCreateOpen} 
      />
      
      {editEmployee && (
        <EmployeeFormDialog 
          companyId={companyId}
          employee={editEmployee}
          open={!!editEmployee} 
          onOpenChange={(open) => !open && setEditEmployee(undefined)} 
        />
      )}

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro</CardTitle>
            <CardDescription>Não foi possível carregar a lista de funcionários.</CardDescription>
          </CardHeader>
        </Card>
      ) : !employees || employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/50">
          <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">Nenhum funcionário cadastrado</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-4">
            A empresa não possui funcionários registrados para o monitoramento de diversidade.
          </p>
          <Button variant="outline" onClick={() => setCreateOpen(true)}>
            Adicionar Funcionário
          </Button>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome e Cargo</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead className="text-right">Salário</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id} className={employee.dismissedAt ? "opacity-60 bg-muted/50" : ""}>
                    <TableCell>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">{employee.role}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm capitalize">{employee.gender.replace('_', ' ')}</div>
                      <div className="text-xs text-muted-foreground">{employee.age} anos</div>
                    </TableCell>
                    <TableCell>
                      {employee.dismissedAt ? (
                        <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/20">
                          Desligado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400">
                          Ativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {employee.formalContract ? (
                        <div className="flex items-center gap-1 text-sm text-primary font-medium">
                          <CheckCircle2 className="h-4 w-4" /> CLT
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-sm text-destructive font-medium">
                          <XCircle className="h-4 w-4" /> Informal/Outro
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(employee.salary)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditEmployee(employee)}>
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
                              <AlertDialogTitle>Remover funcionário?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(employee.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
