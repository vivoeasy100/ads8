import { useGetDashboardSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, BookOpen, Activity } from "lucide-react";
import { ScoreBadge } from "@/components/score-badge";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function DashboardPage() {
  const { data: summary, isLoading, error } = useGetDashboardSummary();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-[400px] lg:col-span-4" />
          <Skeleton className="h-[400px] lg:col-span-3" />
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Erro ao carregar dashboard</CardTitle>
          <CardDescription>Não foi possível carregar os dados do resumo da plataforma.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const stats = [
    {
      name: "Total de Empresas",
      value: summary.totalCompanies,
      icon: Building2,
      description: "Empresas cadastradas",
    },
    {
      name: "Trabalhadores",
      value: summary.totalEmployees,
      icon: Users,
      description: "Funcionários monitorados",
    },
    {
      name: "Treinamentos",
      value: summary.totalTrainings,
      icon: BookOpen,
      description: "Programas registrados",
    },
    {
      name: "Média ODS 8",
      value: summary.averageOds8Score.toFixed(1),
      icon: Activity,
      description: "Score médio global",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard Geral</h1>
        <p className="text-muted-foreground">
          Visão consolidada do alinhamento ao ODS 8: Trabalho Decente e Crescimento Econômico.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={stat.name} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle>Empresas por Porte</CardTitle>
            <CardDescription>
              Distribuição das empresas monitoradas por tamanho.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.companiesBySize}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="size" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted))'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "500ms" }}>
          <CardHeader>
            <CardTitle>Destaques ODS 8</CardTitle>
            <CardDescription>
              Empresas com as melhores pontuações de alinhamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {summary.topPerformers.map((company, i) => (
                <div key={company.id} className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {i + 1}
                  </div>
                  <div className="ml-4 space-y-1 flex-1">
                    <Link href={`/empresas/${company.id}`}>
                      <p className="text-sm font-medium leading-none hover:underline cursor-pointer">
                        {company.name}
                      </p>
                    </Link>
                  </div>
                  <div className="ml-auto font-medium">
                    <ScoreBadge level={company.score >= 80 ? "excelente" : "bom"} score={company.score} />
                  </div>
                </div>
              ))}
              {summary.topPerformers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Nenhuma empresa cadastrada ou com score calculado.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
