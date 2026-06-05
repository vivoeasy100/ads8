import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import {
  useCreateResume,
  useGetResume,
  useUpdateResume,
  getListResumesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  User,
  Briefcase,
  GraduationCap,
  Star,
  Globe,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  CheckCircle2,
} from "lucide-react";
import { Link } from "wouter";

type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
};

type Education = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
};

type Skill = {
  name: string;
  level: "basico" | "intermediario" | "avancado" | "especialista";
};

type Language = {
  language: string;
  proficiency: "basico" | "intermediario" | "avancado" | "fluente" | "nativo";
};

type ResumeData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  linkedinUrl: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
};

const emptyResume: ResumeData = {
  name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  linkedinUrl: "",
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  languages: [],
};

const emptyExperience: Experience = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};

const emptyEducation: Education = {
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
};

const levelLabels: Record<string, string> = {
  basico: "Basico",
  intermediario: "Intermediario",
  avancado: "Avancado",
  especialista: "Especialista",
  fluente: "Fluente",
  nativo: "Nativo",
};

const levelColors: Record<string, number> = {
  basico: 25,
  intermediario: 50,
  avancado: 75,
  especialista: 100,
  fluente: 85,
  nativo: 100,
};

export default function ResumeBuilderPage() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = id !== undefined && id !== "novo";
  const resumeId = isEditing ? parseInt(id, 10) : null;
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data: existingResume, isLoading } = useGetResume(resumeId!, {
    query: { enabled: !!resumeId },
  });

  const [data, setData] = useState<ResumeData>(emptyResume);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("pessoal");

  const createResume = useCreateResume();
  const updateResume = useUpdateResume();

  useEffect(() => {
    if (existingResume) {
      setData({
        name: existingResume.name,
        email: existingResume.email,
        phone: existingResume.phone,
        city: existingResume.city,
        state: existingResume.state,
        linkedinUrl: existingResume.linkedinUrl || "",
        summary: existingResume.summary,
        experiences: JSON.parse(existingResume.experiences || "[]"),
        education: JSON.parse(existingResume.education || "[]"),
        skills: JSON.parse(existingResume.skills || "[]"),
        languages: JSON.parse(existingResume.languages || "[]"),
      });
    }
  }, [existingResume]);

  const setField = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setSaved(false);
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const payload = {
      name: data.name || "Sem nome",
      email: data.email || "",
      phone: data.phone || "",
      city: data.city || "",
      state: data.state || "",
      linkedinUrl: data.linkedinUrl || null,
      summary: data.summary || "",
      experiences: JSON.stringify(data.experiences),
      education: JSON.stringify(data.education),
      skills: JSON.stringify(data.skills),
      languages: JSON.stringify(data.languages),
    };

    if (isEditing && resumeId) {
      await updateResume.mutateAsync({ id: resumeId, data: payload });
    } else {
      const created = await createResume.mutateAsync({ data: payload });
      queryClient.invalidateQueries({ queryKey: getListResumesQueryKey() });
      navigate(`/curriculos/${created.id}`);
      return;
    }
    queryClient.invalidateQueries({ queryKey: getListResumesQueryKey() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Experience helpers
  const addExperience = () => setField("experiences", [...data.experiences, { ...emptyExperience }]);
  const updateExp = (i: number, field: keyof Experience, value: string | boolean) => {
    const updated = data.experiences.map((e, idx) => idx === i ? { ...e, [field]: value } : e);
    setField("experiences", updated);
  };
  const removeExp = (i: number) => setField("experiences", data.experiences.filter((_, idx) => idx !== i));

  // Education helpers
  const addEducation = () => setField("education", [...data.education, { ...emptyEducation }]);
  const updateEdu = (i: number, field: keyof Education, value: string) => {
    const updated = data.education.map((e, idx) => idx === i ? { ...e, [field]: value } : e);
    setField("education", updated);
  };
  const removeEdu = (i: number) => setField("education", data.education.filter((_, idx) => idx !== i));

  // Skill helpers
  const addSkill = () => setField("skills", [...data.skills, { name: "", level: "intermediario" as const }]);
  const updateSkill = (i: number, field: keyof Skill, value: string) => {
    const updated = data.skills.map((s, idx) => idx === i ? { ...s, [field]: value } : s);
    setField("skills", updated);
  };
  const removeSkill = (i: number) => setField("skills", data.skills.filter((_, idx) => idx !== i));

  // Language helpers
  const addLanguage = () => setField("languages", [...data.languages, { language: "", proficiency: "basico" as const }]);
  const updateLang = (i: number, field: keyof Language, value: string) => {
    const updated = data.languages.map((l, idx) => idx === i ? { ...l, [field]: value } : l);
    setField("languages", updated);
  };
  const removeLang = (i: number) => setField("languages", data.languages.filter((_, idx) => idx !== i));

  if (isLoading && isEditing) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-[600px]" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/curriculos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? "Editar Curriculo" : "Novo Curriculo"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Preencha os dados e veja a previa ao vivo
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={createResume.isPending || updateResume.isPending}
          className="gap-2"
        >
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Salvo!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditing ? "Salvar Alteracoes" : "Criar Curriculo"}
            </>
          )}
        </Button>
      </div>

      {/* Editor + Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Left: Form */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full rounded-none border-b h-auto p-0 bg-transparent flex-wrap gap-0">
                {[
                  { value: "pessoal", label: "Dados Pessoais", icon: User },
                  { value: "resumo", label: "Resumo", icon: Briefcase },
                  { value: "experiencia", label: "Experiencias", icon: Briefcase },
                  { value: "formacao", label: "Formacao", icon: GraduationCap },
                  { value: "habilidades", label: "Habilidades", icon: Star },
                  { value: "idiomas", label: "Idiomas", icon: Globe },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === value
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </TabsList>

              {/* Dados Pessoais */}
              <TabsContent value="pessoal" className="p-4 space-y-4 mt-0">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input
                    placeholder="Ex: Maria Silva"
                    value={data.name}
                    onChange={(e) => setField("name", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input
                      type="email"
                      placeholder="maria@email.com"
                      value={data.email}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      placeholder="(11) 99999-9999"
                      value={data.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input
                      placeholder="Sao Paulo"
                      value={data.city}
                      onChange={(e) => setField("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Input
                      placeholder="SP"
                      maxLength={2}
                      value={data.state}
                      onChange={(e) => setField("state", e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn (opcional)</Label>
                  <Input
                    placeholder="linkedin.com/in/mariasilva"
                    value={data.linkedinUrl}
                    onChange={(e) => setField("linkedinUrl", e.target.value)}
                  />
                </div>
              </TabsContent>

              {/* Resumo */}
              <TabsContent value="resumo" className="p-4 space-y-4 mt-0">
                <div className="space-y-2">
                  <Label>Resumo Profissional</Label>
                  <p className="text-xs text-muted-foreground">
                    Escreva 3-5 frases descrevendo sua trajetoria, competencias e objetivo profissional.
                  </p>
                  <Textarea
                    placeholder="Profissional com X anos de experiencia em... Especialidade em... Busco oportunidades para..."
                    rows={7}
                    value={data.summary}
                    onChange={(e) => setField("summary", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {data.summary.length} caracteres
                  </p>
                </div>
              </TabsContent>

              {/* Experiencias */}
              <TabsContent value="experiencia" className="p-4 space-y-4 mt-0">
                {data.experiences.map((exp, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Experiencia {i + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeExp(i)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Empresa</Label>
                        <Input
                          placeholder="Nome da empresa"
                          value={exp.company}
                          onChange={(e) => updateExp(i, "company", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Cargo</Label>
                        <Input
                          placeholder="Seu cargo"
                          value={exp.role}
                          onChange={(e) => updateExp(i, "role", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Data de Inicio</Label>
                        <Input
                          placeholder="Ex: Jan/2020"
                          value={exp.startDate}
                          onChange={(e) => updateExp(i, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Data de Termino</Label>
                        <Input
                          placeholder={exp.isCurrent ? "Atual" : "Ex: Dez/2023"}
                          value={exp.isCurrent ? "Atual" : exp.endDate}
                          disabled={exp.isCurrent}
                          onChange={(e) => updateExp(i, "endDate", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${i}`}
                        checked={exp.isCurrent}
                        onChange={(e) => updateExp(i, "isCurrent", e.target.checked)}
                        className="rounded border-border"
                      />
                      <label htmlFor={`current-${i}`} className="text-sm text-muted-foreground cursor-pointer">
                        Trabalho atual
                      </label>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Descricao das Atividades</Label>
                      <Textarea
                        placeholder="Descreva suas principais responsabilidades e conquistas..."
                        rows={3}
                        value={exp.description}
                        onChange={(e) => updateExp(i, "description", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2" onClick={addExperience}>
                  <Plus className="h-4 w-4" />
                  Adicionar Experiencia
                </Button>
              </TabsContent>

              {/* Formacao */}
              <TabsContent value="formacao" className="p-4 space-y-4 mt-0">
                {data.education.map((edu, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Formacao {i + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeEdu(i)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Instituicao</Label>
                      <Input
                        placeholder="Nome da instituicao"
                        value={edu.institution}
                        onChange={(e) => updateEdu(i, "institution", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Grau</Label>
                        <Select
                          value={edu.degree}
                          onValueChange={(v) => updateEdu(i, "degree", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ensino Medio">Ensino Medio</SelectItem>
                            <SelectItem value="Tecnico">Tecnico</SelectItem>
                            <SelectItem value="Tecnologico">Tecnologico</SelectItem>
                            <SelectItem value="Graduacao">Graduacao (Bacharel/Licenciatura)</SelectItem>
                            <SelectItem value="Pos-Graduacao">Pos-Graduacao / MBA</SelectItem>
                            <SelectItem value="Mestrado">Mestrado</SelectItem>
                            <SelectItem value="Doutorado">Doutorado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Area / Curso</Label>
                        <Input
                          placeholder="Ex: Administracao"
                          value={edu.field}
                          onChange={(e) => updateEdu(i, "field", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Ano de Inicio</Label>
                        <Input
                          placeholder="2018"
                          value={edu.startDate}
                          onChange={(e) => updateEdu(i, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Ano de Conclusao</Label>
                        <Input
                          placeholder="2022 ou Em andamento"
                          value={edu.endDate}
                          onChange={(e) => updateEdu(i, "endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2" onClick={addEducation}>
                  <Plus className="h-4 w-4" />
                  Adicionar Formacao
                </Button>
              </TabsContent>

              {/* Habilidades */}
              <TabsContent value="habilidades" className="p-4 space-y-4 mt-0">
                <p className="text-sm text-muted-foreground">
                  Liste suas habilidades tecnicas, ferramentas e competencias relevantes.
                </p>
                {data.skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder="Ex: Excel, Python, AutoCAD..."
                      className="flex-1"
                      value={skill.name}
                      onChange={(e) => updateSkill(i, "name", e.target.value)}
                    />
                    <Select
                      value={skill.level}
                      onValueChange={(v) => updateSkill(i, "level", v)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basico">Basico</SelectItem>
                        <SelectItem value="intermediario">Intermediario</SelectItem>
                        <SelectItem value="avancado">Avancado</SelectItem>
                        <SelectItem value="especialista">Especialista</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
                      onClick={() => removeSkill(i)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2" onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                  Adicionar Habilidade
                </Button>
              </TabsContent>

              {/* Idiomas */}
              <TabsContent value="idiomas" className="p-4 space-y-4 mt-0">
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder="Ex: Ingles, Espanhol..."
                      className="flex-1"
                      value={lang.language}
                      onChange={(e) => updateLang(i, "language", e.target.value)}
                    />
                    <Select
                      value={lang.proficiency}
                      onValueChange={(v) => updateLang(i, "proficiency", v)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basico">Basico</SelectItem>
                        <SelectItem value="intermediario">Intermediario</SelectItem>
                        <SelectItem value="avancado">Avancado</SelectItem>
                        <SelectItem value="fluente">Fluente</SelectItem>
                        <SelectItem value="nativo">Nativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
                      onClick={() => removeLang(i)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2" onClick={addLanguage}>
                  <Plus className="h-4 w-4" />
                  Adicionar Idioma
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Right: Live Preview */}
        <div className="sticky top-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-4 border-b bg-muted/30">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pre-visualizacao do Curriculo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 bg-white text-gray-900 min-h-[600px] text-sm font-serif">
                {/* Header */}
                <div className="border-b-2 border-primary pb-4 mb-4">
                  <h1 className="text-2xl font-bold text-primary">
                    {data.name || <span className="text-gray-300">Seu Nome</span>}
                  </h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                    {data.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {data.email}
                      </span>
                    )}
                    {data.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {data.phone}
                      </span>
                    )}
                    {(data.city || data.state) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {[data.city, data.state].filter(Boolean).join(", ")}
                      </span>
                    )}
                    {data.linkedinUrl && (
                      <span className="flex items-center gap-1">
                        <Linkedin className="h-3 w-3" /> {data.linkedinUrl}
                      </span>
                    )}
                  </div>
                </div>

                {/* Resumo */}
                {data.summary && (
                  <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">
                      Resumo Profissional
                    </h2>
                    <p className="text-xs leading-relaxed text-gray-700">{data.summary}</p>
                  </div>
                )}

                {/* Experiencias */}
                {data.experiences.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                      Experiencia Profissional
                    </h2>
                    <div className="space-y-3">
                      {data.experiences.map((exp, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-baseline">
                            <div>
                              <span className="font-semibold text-xs">{exp.role || "Cargo"}</span>
                              {exp.company && <span className="text-gray-600 text-xs"> — {exp.company}</span>}
                            </div>
                            <span className="text-xs text-gray-500 shrink-0 ml-2">
                              {exp.startDate}{exp.startDate && (exp.isCurrent || exp.endDate) ? " - " : ""}
                              {exp.isCurrent ? "Atual" : exp.endDate}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formacao */}
                {data.education.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                      Formacao Academica
                    </h2>
                    <div className="space-y-2">
                      {data.education.map((edu, i) => (
                        <div key={i} className="flex justify-between items-baseline">
                          <div>
                            <span className="font-semibold text-xs">
                              {[edu.degree, edu.field].filter(Boolean).join(" em ") || "Curso"}
                            </span>
                            {edu.institution && (
                              <span className="text-gray-600 text-xs"> — {edu.institution}</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 shrink-0 ml-2">
                            {edu.startDate}{edu.startDate && edu.endDate ? " - " : ""}{edu.endDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {data.skills.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                      Habilidades
                    </h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {data.skills.map((skill, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-xs font-medium">{skill.name || "Habilidade"}</span>
                            <span className="text-[10px] text-gray-500">{levelLabels[skill.level]}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${levelColors[skill.level] || 50}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Idiomas */}
                {data.languages.length > 0 && (
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                      Idiomas
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {data.languages.map((lang, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-xs font-medium">{lang.language || "Idioma"}</span>
                          <Badge variant="outline" className="text-[10px] py-0 h-4">
                            {levelLabels[lang.proficiency]}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {!data.name && !data.summary && data.experiences.length === 0 && data.skills.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <User className="h-10 w-10 text-gray-200 mb-3" />
                    <p className="text-gray-400 text-xs">
                      Preencha os campos ao lado para ver a previa do curriculo
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
