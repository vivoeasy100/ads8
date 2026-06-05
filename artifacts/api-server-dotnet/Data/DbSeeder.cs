using System;
using System.Collections.Generic;
using System.Linq;
using TrabalhoJusto.Api.Models;

namespace TrabalhoJusto.Api.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            if (!context.Jobs.Any())
            {
                var jobs = new List<Job>
                {
                    new Job
                    {
                        Title = "Analista Administrativo",
                        Company = "Grupo Alfa Servicos",
                        Location = "Sao Paulo, SP",
                        Type = "clt",
                        Area = "Administracao",
                        SalaryMin = 2800,
                        SalaryMax = 3800,
                        Description = "Responsavel por suporte administrativo, controle de documentos, agendamento e atendimento interno. Trabalho hibrido 3x por semana.",
                        Requirements = "[\"Ensino medio completo\",\"Experiencia minima de 1 ano em administrativo\",\"Conhecimento em pacote Office\"]",
                        Skills = "[\"Excel\",\"Word\",\"Atendimento ao cliente\",\"Organizacao\",\"Comunicacao\"]",
                        Benefits = "[\"Vale transporte\",\"Vale refeicao\",\"Plano de saude\",\"PLR\"]",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Job
                    {
                        Title = "Operador de Logistica",
                        Company = "TransBrasil Cargas",
                        Location = "Guarulhos, SP",
                        Type = "clt",
                        Area = "Logistica",
                        SalaryMin = 2200,
                        SalaryMax = 2800,
                        Description = "Separacao, conferencia e movimentacao de mercadorias. Controle de estoque via sistema WMS. Turno fixo diurno.",
                        Requirements = "[\"Ensino medio completo\",\"Disponibilidade para trabalho em turno\",\"Experiencia em deposito ou logistica\"]",
                        Skills = "[\"Logistica\",\"Controle de estoque\",\"WMS\",\"Trabalho em equipe\"]",
                        Benefits = "[\"Vale transporte\",\"Vale alimentacao\",\"Seguro de vida\",\"Adicional de turno\"]",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Job
                    {
                        Title = "Assistente Financeiro",
                        Company = "Contabilidade Modelo Ltda",
                        Location = "Santo Andre, SP",
                        Type = "clt",
                        Area = "Financeiro",
                        SalaryMin = 3000,
                        SalaryMax = 4200,
                        Description = "Controle de contas a pagar e receber, conciliacao bancaria, emissao de boletos e relatorios financeiros mensais.",
                        Requirements = "[\"Curso tecnico ou superior em Contabilidade/Financas\",\"Conhecimento em Excel avancado\",\"Experiencia minima de 6 meses\"]",
                        Skills = "[\"Excel\",\"Conciliacao bancaria\",\"Contas a pagar\",\"Contas a receber\",\"ERP\"]",
                        Benefits = "[\"Vale transporte\",\"Vale refeicao\",\"Plano odontologico\",\"Gympass\"]",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Job
                    {
                        Title = "Tecnico de Manutencao Eletrica",
                        Company = "Industria Metalica Nacional",
                        Location = "Osasco, SP",
                        Type = "clt",
                        Area = "Industria",
                        SalaryMin = 4000,
                        SalaryMax = 5500,
                        Description = "Manutencao preventiva e corretiva de maquinas industriais, paineis eletricos e sistemas de automacao. Atuacao em fabrica de grande porte.",
                        Requirements = "[\"Tecnico em Eletrotecnica ou Eletrica\",\"NR10 e NR35 atualizados\",\"Experiencia com CLP e inversores de frequencia\"]",
                        Skills = "[\"Eletrica industrial\",\"CLP\",\"Automacao\",\"Manutencao preventiva\",\"NR10\"]",
                        Benefits = "[\"Vale transporte\",\"Refeicao no local\",\"Plano de saude\",\"Adicional de insalubridade\"]",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Job
                    {
                        Title = "Atendente de Loja",
                        Company = "Rede Moda Brasil",
                        Location = "Campinas, SP",
                        Type = "clt",
                        Area = "Varejo",
                        SalaryMin = 1800,
                        SalaryMax = 2400,
                        Description = "Atendimento ao cliente, organizacao da loja, controle de estoque e suporte ao caixa. Trabalho em escala 6x1.",
                        Requirements = "[\"Ensino medio completo\",\"Boa comunicacao\",\"Disponibilidade para trabalhar aos fins de semana\"]",
                        Skills = "[\"Atendimento ao cliente\",\"Vendas\",\"Organizacao\",\"Comunicacao\"]",
                        Benefits = "[\"Vale transporte\",\"Vale refeicao\",\"Comissao sobre vendas\",\"Desconto em produtos\"]",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Job
                    {
                        Title = "Auxiliar de Recursos Humanos",
                        Company = "Grupo Santana RH",
                        Location = "Sao Paulo, SP",
                        Type = "clt",
                        Area = "Recursos Humanos",
                        SalaryMin = 2400,
                        SalaryMax = 3200,
                        Description = "Apoio no processo de recrutamento e selecao, admissao, controle de ponto e beneficios. Trabalho 100% presencial.",
                        Requirements = "[\"Cursando ou formado em Gestao de RH, Psicologia ou ADM\",\"Conhecimento em CLT\",\"Excel intermediario\"]",
                        Skills = "[\"Recrutamento\",\"CLT\",\"Excel\",\"Atendimento\",\"Organizacao\"]",
                        Benefits = "[\"Vale transporte\",\"Vale refeicao\",\"Plano de saude\",\"Universidade corporativa\"]",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Job
                    {
                        Title = "Desenvolvedor Web Junior",
                        Company = "StartUp Digital SP",
                        Location = "Sao Paulo, SP (Remoto)",
                        Type = "clt",
                        Area = "Tecnologia",
                        SalaryMin = 3500,
                        SalaryMax = 5000,
                        Description = "Desenvolvimento de interfaces web com React e integracao com APIs REST. Trabalho 100% remoto com equipe jovem e dinamica.",
                        Requirements = "[\"Conhecimento em HTML, CSS e JavaScript\",\"Experiencia basica com React\",\"Git/GitHub\"]",
                        Skills = "[\"HTML\",\"CSS\",\"JavaScript\",\"React\",\"Git\"]",
                        Benefits = "[\"Vale refeicao\",\"Plano de saude\",\"Home office\",\"Stock options\"]",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Job
                    {
                        Title = "Vendedor Externo",
                        Company = "Distribuidora Horizonte",
                        Location = "Regiao de SP",
                        Type = "clt",
                        Area = "Vendas",
                        SalaryMin = 2500,
                        SalaryMax = 5000,
                        Description = "Prospectar novos clientes, apresentar produtos e fechar contratos na regiao metropolitana de Sao Paulo. Carro fornecido pela empresa.",
                        Requirements = "[\"CNH categoria B\",\"Experiencia em vendas externas\",\"Facilidade com negociacao\"]",
                        Skills = "[\"Vendas\",\"Negociacao\",\"Prospecao\",\"CRM\",\"Comunicacao\"]",
                        Benefits = "[\"Carro da empresa\",\"Combustivel\",\"Comissao\",\"Plano de saude\"]",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                context.Jobs.AddRange(jobs);
                context.SaveChanges();
            }

            if (!context.Courses.Any())
            {
                var courses = new List<Course>
                {
                    new Course
                    {
                        Title = "Excel do Zero ao Avancado",
                        Provider = "SENAC",
                        Area = "Administracao",
                        Level = "iniciante",
                        DurationHours = 40,
                        Description = "Aprenda todas as funcionalidades do Excel para uso profissional: formulas, tabelas dinamicas, macros e graficos. Certificado reconhecido pelo mercado.",
                        Skills = "[\"Excel\",\"Planilhas\",\"Analise de dados\",\"Graficos\"]",
                        Url = "https://www.senac.br",
                        IsFree = "false",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Course
                    {
                        Title = "Logistica e Supply Chain",
                        Provider = "SEBRAE",
                        Area = "Logistica",
                        Level = "intermediario",
                        DurationHours = 20,
                        Description = "Conceitos fundamentais de logistica, cadeia de suprimentos, gestao de estoque e distribuicao para pequenas e medias empresas.",
                        Skills = "[\"Logistica\",\"Supply chain\",\"Controle de estoque\",\"Distribuicao\"]",
                        Url = "https://www.sebrae.com.br",
                        IsFree = "true",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Course
                    {
                        Title = "Comunicacao e Atendimento ao Cliente",
                        Provider = "SENAI",
                        Area = "Varejo",
                        Level = "iniciante",
                        DurationHours = 16,
                        Description = "Tecnicas de comunicacao eficaz, resolucao de conflitos e fidelizacao de clientes. Ideal para quem trabalha ou quer trabalhar no comercio.",
                        Skills = "[\"Comunicacao\",\"Atendimento ao cliente\",\"Vendas\",\"Relacionamento\"]",
                        Url = "https://www.senai.br",
                        IsFree = "true",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Course
                    {
                        Title = "Tecnico em Seguranca do Trabalho",
                        Provider = "SENAC",
                        Area = "Industria",
                        Level = "intermediario",
                        DurationHours = 120,
                        Description = "Formacao tecnica em seguranca e saude no trabalho, NRs, analise de riscos e implantacao de CIPA. Certificado de nivel tecnico.",
                        Skills = "[\"NR10\",\"NR35\",\"Seguranca do trabalho\",\"CIPA\",\"Analise de riscos\"]",
                        Url = "https://www.senac.br",
                        IsFree = "false",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Course
                    {
                        Title = "Gestao Financeira para Pequenas Empresas",
                        Provider = "SEBRAE",
                        Area = "Financeiro",
                        Level = "iniciante",
                        DurationHours = 8,
                        Description = "Controle de fluxo de caixa, conciliacao bancaria, planejamento financeiro e como separar financas pessoais das empresariais.",
                        Skills = "[\"Financas\",\"Fluxo de caixa\",\"Conciliacao bancaria\",\"Planejamento financeiro\"]",
                        Url = "https://www.sebrae.com.br",
                        IsFree = "true",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Course
                    {
                        Title = "HTML e CSS para Iniciantes",
                        Provider = "Coursera - Google",
                        Area = "Tecnologia",
                        Level = "iniciante",
                        DurationHours = 30,
                        Description = "Crie suas primeiras paginas web com HTML e CSS. Aprenda a estrutura basica de sites e estilizacao responsiva. Certificado Google.",
                        Skills = "[\"HTML\",\"CSS\",\"Web design\",\"Responsivo\"]",
                        Url = "https://www.coursera.org",
                        IsFree = "false",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Course
                    {
                        Title = "Recrutamento e Selecao na Pratica",
                        Provider = "FGV Online",
                        Area = "Recursos Humanos",
                        Level = "intermediario",
                        DurationHours = 25,
                        Description = "Tecnicas de entrevista, triagem de curriculos, avaliacao por competencias e uso de ferramentas digitais de recrutamento.",
                        Skills = "[\"Recrutamento\",\"Selecao\",\"Entrevista\",\"RH\",\"Gestao de pessoas\"]",
                        Url = "https://eadbox.fgv.br",
                        IsFree = "false",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Course
                    {
                        Title = "Tecnicas de Vendas e Negociacao",
                        Provider = "SENAC",
                        Area = "Vendas",
                        Level = "iniciante",
                        DurationHours = 20,
                        Description = "Estrategias de prospecao, abordagem, apresentacao de produto, tratamento de objecoes e fechamento de vendas. Pratico e objetivo.",
                        Skills = "[\"Vendas\",\"Negociacao\",\"Prospecao\",\"Fechamento\",\"Comunicacao\"]",
                        Url = "https://www.senac.br",
                        IsFree = "false",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Course
                    {
                        Title = "Power BI para Analise de Dados",
                        Provider = "Microsoft Learn",
                        Area = "Administracao",
                        Level = "intermediario",
                        DurationHours = 15,
                        Description = "Criacao de dashboards e relatorios interativos com Power BI. Transforme dados brutos em insights visuais para tomada de decisao.",
                        Skills = "[\"Power BI\",\"Analise de dados\",\"Dashboard\",\"Excel\",\"Business intelligence\"]",
                        Url = "https://learn.microsoft.com",
                        IsFree = "true",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Course
                    {
                        Title = "Introducao ao Python",
                        Provider = "Fundacao Bradesco",
                        Area = "Tecnologia",
                        Level = "iniciante",
                        DurationHours = 36,
                        Description = "Aprenda programacao com Python do zero. Variaveis, funcoes, estruturas de dados e automacao de tarefas. Certificado gratuito.",
                        Skills = "[\"Python\",\"Programacao\",\"Automacao\",\"Logica de programacao\"]",
                        Url = "https://www.ev.org.br",
                        IsFree = "true",
                        CreatedAt = DateTime.UtcNow
                    }
                };

                context.Courses.AddRange(courses);
                context.SaveChanges();
            }
        }
    }
}
