import { Link, useLocation } from "wouter";
import {
  Building2,
  LayoutDashboard,
  Menu,
  HeartHandshake,
  FileText,
  Briefcase,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useHealthCheck } from "@workspace/api-client-react";
import { AuthHeader } from "./auth-header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { data: health } = useHealthCheck();

  const navigation = [
    { name: "Dashboard Geral", href: "/", icon: LayoutDashboard },
    { name: "Empresas", href: "/empresas", icon: Building2 },
    { name: "Curriculos", href: "/curriculos", icon: FileText },
    { name: "Vagas de Emprego", href: "/vagas", icon: Briefcase },
    { name: "Cursos", href: "/cursos", icon: BookOpen },
    { name: "Recomendacoes", href: "/recomendacoes", icon: Sparkles },
  ];

  const NavLinks = () => (
    <div className="space-y-1">
      {navigation.map((item) => {
        const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
        return (
          <Link key={item.name} href={item.href}>
            <span
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => setOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-background md:flex-row">
      {/* Mobile Nav */}
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-card px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-16 items-center border-b px-6">
              <div className="flex items-center gap-2 font-bold text-primary">
                <HeartHandshake className="h-5 w-5" />
                <span>TrabalhoJusto</span>
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-4rem)] pb-10 pl-6 pr-6 pt-4">
              <NavLinks />
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 font-bold text-primary flex-1">
          <HeartHandshake className="h-5 w-5" />
          <span>TrabalhoJusto</span>
        </div>
        <AuthHeader />
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b">
          <div className="flex items-center gap-2 font-bold text-primary text-lg tracking-tight">
            <HeartHandshake className="h-6 w-6" />
            <span>TrabalhoJusto</span>
          </div>
          <AuthHeader />
        </div>
        <ScrollArea className="flex-1 px-4 py-4">
          <NavLinks />
        </ScrollArea>
        <div className="p-4 border-t text-xs text-muted-foreground flex items-center justify-between">
          <span>Sistema ODS 8</span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${health?.status === "ok" ? "bg-green-500" : "bg-red-500"}`}></span>
            API
          </span>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <ScrollArea className="h-[calc(100dvh)] md:h-screen">
          <div className="container mx-auto p-4 md:p-8 max-w-6xl animate-in fade-in duration-500">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
