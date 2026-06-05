import { useState } from "react";
import { useLocation } from "wouter";
import { useUserProfile } from "@/context/user-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake, User, Phone, Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { profile, saveProfile, isLoggedIn } = useUserProfile();
  const [, navigate] = useLocation();

  const [form, setForm] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Informe seu nome completo";
    if (!form.phone.trim()) errs.phone = "Informe seu telefone";
    if (!form.email.trim()) errs.email = "Informe seu e-mail";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "E-mail invalido";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    saveProfile({ name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim() });
    setSaved(true);
    setTimeout(() => navigate("/"), 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <HeartHandshake className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">TrabalhoJusto</h1>
          <p className="text-muted-foreground text-sm">
            {isLoggedIn ? "Atualize seu perfil" : "Crie seu perfil para acessar vagas e recomendacoes personalizadas"}
          </p>
        </div>

        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {isLoggedIn ? "Editar Perfil" : "Cadastro de Usuario"}
            </CardTitle>
            <CardDescription>
              Preencha seus dados para continuar. Suas informacoes ficam salvas no dispositivo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Maria Silva"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              {/* Telefone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  Telefone / WhatsApp
                </Label>
                <Input
                  id="phone"
                  placeholder="Ex: (11) 99999-9999"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  E-mail (Gmail ou outro)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: maria@gmail.com"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={saved}
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Perfil salvo! Redirecionando...
                  </>
                ) : (
                  <>
                    {isLoggedIn ? "Salvar Alteracoes" : "Criar Perfil e Entrar"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Seus dados sao armazenados apenas neste dispositivo e nao sao compartilhados com terceiros.
        </p>
      </div>
    </div>
  );
}
