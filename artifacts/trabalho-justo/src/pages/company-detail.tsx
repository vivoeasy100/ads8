import { useParams } from "wouter";
import { 
  useGetCompany, 
  useGetOds8Score, 
  useGetIndicatorTrends, 
  useGetDiversityBreakdown,
  getGetCompanyQueryKey,
  getGetOds8ScoreQueryKey,
  getGetIndicatorTrendsQueryKey,
  getGetDiversityBreakdownQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreBadge } from "@/components/score-badge";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Users, 
  BookOpen, 
  ChevronRight, 
  MapPin, 
  Briefcase,
  Target,
  AlertCircle
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const companyId = parseInt(id, 10);

  const { data: company, isLoading: loadingCompany } = useGetCompany(companyId, {
    query: { enabled: !!companyId, queryKey: getGetCompanyQueryKey(companyId) }
  });

  const { data: scoreData, isLoading: loadingScore } = useGetOds8Score(companyId, {
    query: { enabled: !!companyId, queryKey: getGetOds8ScoreQueryKey(companyId) }
  });

  const { data: trends, isLoading: loadingTrends } = useGetIndicatorTrends(companyId, {
    query: { enabled: !!companyId, queryKey: getGetIndicatorTrendsQueryKey(companyId) }
  });

  const { data: diversity, isLoading: loadingDiversity } = useGetDiversityBreakdown(companyId, {
    query: { enabled: !!companyId, queryKey: getGetDiversityBreakdownQueryKey(companyId) }
  });

  if (loadingCompany) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px] md:col-span-2" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!company) {
    return <div>Empresa não encontrada.</div>;
  }

  // Format data for charts
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];
  
  // Pivot trends data by period for the line chart
  const trendsByPeriod = trends?.reduce((acc: any[], curr) => {
    let periodObj = acc.find(item => item.period === curr.period);
    if (!periodObj) {
      periodObj = { period: curr.period };
      acc.push(periodObj);
    }
    periodObj[curr.category] = curr.value;
    return acc;
  }, []) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/empresas"><span className="hover:text-primary cursor-pointer transition-colors">Empresas</span></Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{company.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{company.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {company.city}, {company.state}</span>
            <span className="flex items-center gap-1"><Briefcase className="h-4 w-4"/> {company.sector}</span>
            <span className="flex items-center gap-1 capitalize"><Users className="h-4 w-4"/> Porte {company.size}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/empresas/${companyId}/indicadores`}>
            <Button variant="outline" className="gap-2">
              <Activity className="h-4 w-4" /> Indicadores
            </Button>
          </Link>
          <Link href={`/empresas/${companyId}/funcionarios`}>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" /> Funcionários
            </Button>
          </Link>
          <Link href={`/empresas/${companyId}/treinamentos`}>
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" /> Treinamentos
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Score Card */}
        <Card className="border-l-4 border-l-primary shadow-sm bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              Índice ODS 8
              <Target className="h-5 w-5 text-primary" />
            </CardTitle>
            <CardDescription>Trabalho Decente e Crescimento</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingScore ? <Skeleton className="h-16 w-32" /> : scoreData ? (
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-primary">{scoreData.overallScore}</span>
                  <span className="text-xl text-muted-foreground">/100</span>
                </div>
                <ScoreBadge level={scoreData.level} className="text-sm px-3 py-1" />
              </div>
            ) : <span className="text-muted-foreground">Sem dados suficientes.</span>}
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Composição do Índice</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingScore ? <Skeleton className="h-24 w-full" /> : scoreData && scoreData.breakdown.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {scoreData.breakdown.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium text-muted-foreground">{item.category.replace('_', ' ')}</span>
                      <span className="font-bold">{item.score}/100</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${item.score}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Adicione indicadores para gerar o detalhamento.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {scoreData?.recommendations && scoreData.recommendations.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30 dark:bg-amber-950/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-500">
              <AlertCircle className="h-5 w-5" />
              Recomendações Estratégicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {scoreData.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evolução dos Indicadores</CardTitle>
            <CardDescription>Acompanhamento histórico (últimos períodos)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {loadingTrends ? <Skeleton className="h-full w-full" /> : trendsByPeriod.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendsByPeriod}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                    />
                    <Legend />
                    {Object.keys(trendsByPeriod[0] || {}).filter(k => k !== 'period').map((key, i) => (
                      <Line 
                        key={key} 
                        type="monotone" 
                        dataKey={key} 
                        name={key.replace('_', ' ')}
                        stroke={COLORS[i % COLORS.length]} 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm flex-col gap-2">
                  <Activity className="h-8 w-8 opacity-20" />
                  Sem histórico suficiente
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Diversity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Panorama de Diversidade</CardTitle>
            <CardDescription>Distribuição por gênero e faixa etária</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDiversity ? <Skeleton className="h-[300px] w-full" /> : diversity ? (
              <div className="grid grid-rows-[auto_1fr] h-[300px] gap-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Formalidade (CLT)</span>
                  <span className="font-bold text-primary">{diversity.formalContractRate.toFixed(1)}%</span>
                </div>
                <div className="flex h-full gap-4">
                  <div className="flex-1 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={diversity.genderDistribution}
                          dataKey="count"
                          nameKey="gender"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {diversity.genderDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 min-w-0">
                     <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={diversity.ageGroups} layout="vertical" margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="group" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} width={40} />
                        <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                        <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm flex-col gap-2">
                <Users className="h-8 w-8 opacity-20" />
                Cadastre funcionários para ver o panorama
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
