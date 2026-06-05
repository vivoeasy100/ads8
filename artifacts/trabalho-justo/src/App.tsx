import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";
import { UserProfileProvider } from "@/context/user-profile";
import DashboardPage from "@/pages/dashboard";
import CompaniesPage from "@/pages/companies";
import CompanyDetailPage from "@/pages/company-detail";
import IndicatorsPage from "@/pages/indicators";
import EmployeesPage from "@/pages/employees";
import TrainingsPage from "@/pages/trainings";
import ResumesPage from "@/pages/resumes";
import ResumeBuilderPage from "@/pages/resume-builder";
import JobsPage from "@/pages/jobs";
import JobDetailPage from "@/pages/job-detail";
import CoursesPage from "@/pages/courses";
import CourseDetailPage from "@/pages/course-detail";
import RecommendationsPage from "@/pages/recommendations";
import LoginPage from "@/pages/login";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/entrar" component={LoginPage} />
        <Route path="/empresas" component={CompaniesPage} />
        <Route path="/empresas/:id" component={CompanyDetailPage} />
        <Route path="/empresas/:id/indicadores" component={IndicatorsPage} />
        <Route path="/empresas/:id/funcionarios" component={EmployeesPage} />
        <Route path="/empresas/:id/treinamentos" component={TrainingsPage} />
        <Route path="/curriculos" component={ResumesPage} />
        <Route path="/curriculos/:id" component={ResumeBuilderPage} />
        <Route path="/vagas" component={JobsPage} />
        <Route path="/vagas/:id" component={JobDetailPage} />
        <Route path="/cursos" component={CoursesPage} />
        <Route path="/cursos/:id" component={CourseDetailPage} />
        <Route path="/recomendacoes" component={RecommendationsPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProfileProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </UserProfileProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
