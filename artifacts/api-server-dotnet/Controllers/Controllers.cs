using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrabalhoJusto.Api.Data;
using TrabalhoJusto.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace TrabalhoJusto.Api.Controllers
{
    [ApiController]
    [Route("api")]
    public class HealthController : ControllerBase
    {
        [HttpGet("healthz")]
        public IActionResult GetHealth()
        {
            return Ok(new { status = "healthy" });
        }
    }

    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        [HttpGet("user")]
        public IActionResult GetUser()
        {
            // Return mock user for local testing
            return Ok(new
            {
                user = new
                {
                    id = "mock-user-id",
                    email = "usuario@trabalhojusto.com.br",
                    firstName = "Administrador",
                    lastName = "ODS8",
                    profileImageUrl = (string?)null
                }
            });
        }
    }

    [ApiController]
    [Route("api/companies")]
    public class CompaniesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CompaniesController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> ListCompanies()
        {
            return await _context.Companies.OrderBy(c => c.CreatedAt).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Company>> CreateCompany([FromBody] Company company)
        {
            company.CreatedAt = DateTime.UtcNow;
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCompany), new { id = company.Id }, company);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Company>> GetCompany(int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null) return NotFound(new { error = "Empresa não encontrada" });
            return company;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompany(int id, [FromBody] Company updated)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null) return NotFound(new { error = "Empresa não encontrada" });

            company.Name = updated.Name;
            company.Sector = updated.Sector;
            company.Size = updated.Size;
            company.City = updated.City;
            company.State = updated.State;

            await _context.SaveChangesAsync();
            return Ok(company);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null) return NotFound(new { error = "Empresa não encontrada" });

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    [ApiController]
    [Route("api/companies/{companyId}/indicators")]
    public class IndicatorsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public IndicatorsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Indicator>>> ListIndicators(int companyId)
        {
            return await _context.Indicators
                .Where(i => i.CompanyId == companyId)
                .OrderBy(i => i.Period)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Indicator>> CreateIndicator(int companyId, [FromBody] Indicator indicator)
        {
            indicator.CompanyId = companyId;
            indicator.CreatedAt = DateTime.UtcNow;
            _context.Indicators.Add(indicator);
            await _context.SaveChangesAsync();
            return StatusCode(201, indicator);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIndicator(int companyId, int id, [FromBody] Indicator updated)
        {
            var indicator = await _context.Indicators.FindAsync(id);
            if (indicator == null || indicator.CompanyId != companyId)
                return NotFound(new { error = "Indicador não encontrado" });

            indicator.Category = updated.Category;
            indicator.Value = updated.Value;
            indicator.Unit = updated.Unit;
            indicator.Period = updated.Period;
            indicator.Notes = updated.Notes;

            await _context.SaveChangesAsync();
            return Ok(indicator);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIndicator(int companyId, int id)
        {
            var indicator = await _context.Indicators.FindAsync(id);
            if (indicator == null || indicator.CompanyId != companyId)
                return NotFound(new { error = "Indicador não encontrado" });

            _context.Indicators.Remove(indicator);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    [ApiController]
    [Route("api/companies/{companyId}/employees")]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public EmployeesController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> ListEmployees(int companyId)
        {
            return await _context.Employees
                .Where(e => e.CompanyId == companyId)
                .OrderBy(e => e.HiredAt)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(int companyId, [FromBody] Employee employee)
        {
            employee.CompanyId = companyId;
            if (employee.HiredAt == default) employee.HiredAt = DateTime.UtcNow;
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return StatusCode(201, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int companyId, int id, [FromBody] Employee updated)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null || employee.CompanyId != companyId)
                return NotFound(new { error = "Funcionário não encontrado" });

            employee.Name = updated.Name;
            employee.Role = updated.Role;
            employee.Gender = updated.Gender;
            employee.Age = updated.Age;
            employee.Salary = updated.Salary;
            employee.FormalContract = updated.FormalContract;
            employee.HiredAt = updated.HiredAt;
            employee.DismissedAt = updated.DismissedAt;

            await _context.SaveChangesAsync();
            return Ok(employee);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int companyId, int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null || employee.CompanyId != companyId)
                return NotFound(new { error = "Funcionário não encontrado" });

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    [ApiController]
    [Route("api/companies/{companyId}/trainings")]
    public class TrainingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TrainingsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Training>>> ListTrainings(int companyId)
        {
            return await _context.Trainings
                .Where(t => t.CompanyId == companyId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Training>> CreateTraining(int companyId, [FromBody] Training training)
        {
            training.CompanyId = companyId;
            training.CreatedAt = DateTime.UtcNow;
            _context.Trainings.Add(training);
            await _context.SaveChangesAsync();
            return StatusCode(201, training);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTraining(int companyId, int id, [FromBody] Training updated)
        {
            var training = await _context.Trainings.FindAsync(id);
            if (training == null || training.CompanyId != companyId)
                return NotFound(new { error = "Treinamento não encontrado" });

            training.Title = updated.Title;
            training.Type = updated.Type;
            training.HoursTotal = updated.HoursTotal;
            training.ParticipantsCount = updated.ParticipantsCount;
            training.CompletedAt = updated.CompletedAt;

            await _context.SaveChangesAsync();
            return Ok(training);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTraining(int companyId, int id)
        {
            var training = await _context.Trainings.FindAsync(id);
            if (training == null || training.CompanyId != companyId)
                return NotFound(new { error = "Treinamento não encontrado" });

            _context.Trainings.Remove(training);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    [ApiController]
    [Route("api/curriculos")]
    public class ResumesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ResumesController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resume>>> ListResumes()
        {
            return await _context.Resumes.OrderByDescending(r => r.CreatedAt).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Resume>> CreateResume([FromBody] Resume resume)
        {
            resume.CreatedAt = DateTime.UtcNow;
            resume.UpdatedAt = DateTime.UtcNow;
            _context.Resumes.Add(resume);
            await _context.SaveChangesAsync();
            return StatusCode(201, resume);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Resume>> GetResume(int id)
        {
            var resume = await _context.Resumes.FindAsync(id);
            if (resume == null) return NotFound(new { error = "Currículo não encontrado" });
            return resume;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResume(int id, [FromBody] Resume updated)
        {
            var resume = await _context.Resumes.FindAsync(id);
            if (resume == null) return NotFound(new { error = "Currículo não encontrado" });

            resume.Name = updated.Name;
            resume.Email = updated.Email;
            resume.Phone = updated.Phone;
            resume.City = updated.City;
            resume.State = updated.State;
            resume.LinkedinUrl = updated.LinkedinUrl;
            resume.Summary = updated.Summary;
            resume.Experiences = updated.Experiences;
            resume.Education = updated.Education;
            resume.Skills = updated.Skills;
            resume.Languages = updated.Languages;
            resume.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(resume);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResume(int id)
        {
            var resume = await _context.Resumes.FindAsync(id);
            if (resume == null) return NotFound(new { error = "Currículo não encontrado" });

            _context.Resumes.Remove(resume);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    [ApiController]
    [Route("api/vagas")]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public JobsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Job>>> ListJobs()
        {
            return await _context.Jobs
                .Where(j => j.IsActive)
                .OrderBy(j => j.CreatedAt)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Job>> GetJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound(new { error = "Vaga não encontrada" });
            return job;
        }
    }

    [ApiController]
    [Route("api/cursos")]
    public class CoursesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CoursesController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> ListCourses()
        {
            return await _context.Courses.OrderBy(c => c.CreatedAt).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound(new { error = "Curso não encontrado" });
            return course;
        }
    }

    public class SkillItem
    {
        public string Name { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/recomendacoes")]
    public class RecommendationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public RecommendationsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetRecommendations([FromQuery] int? curriculoId)
        {
            var resumeSkills = new List<string>();

            if (curriculoId.HasValue)
            {
                var resume = await _context.Resumes.FindAsync(curriculoId.Value);
                if (resume != null)
                {
                    try
                    {
                        var parsedSkills = JsonSerializer.Deserialize<List<SkillItem>>(resume.Skills, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (parsedSkills != null)
                        {
                            resumeSkills = parsedSkills.Select(s => s.Name.ToLower()).ToList();
                        }
                    }
                    catch
                    {
                        resumeSkills = new List<string>();
                    }
                }
            }

            var allJobs = await _context.Jobs.Where(j => j.IsActive).ToListAsync();
            var allCourses = await _context.Courses.ToListAsync();

            double ScoreSkills(string jsonSkills)
            {
                if (!resumeSkills.Any()) return new Random().NextDouble();
                try
                {
                    // Skills are saved as JSON array of strings: ["HTML", "CSS"]
                    var skills = JsonSerializer.Deserialize<List<string>>(jsonSkills, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (skills == null || !skills.Any()) return 0;
                    var lowerSkills = skills.Select(s => s.ToLower()).ToList();
                    var matches = resumeSkills.Count(rs => lowerSkills.Any(js => js.Contains(rs) || rs.Contains(js)));
                    return (double)matches / Math.Max(lowerSkills.Count, 1);
                }
                catch
                {
                    return 0;
                }
            }

            var scoredJobs = allJobs
                .Select(j => new { Job = j, Score = ScoreSkills(j.Skills) })
                .OrderByDescending(x => x.Score)
                .Take(6)
                .Select(x => x.Job)
                .ToList();

            var scoredCourses = allCourses
                .Select(c => new { Course = c, Score = ScoreSkills(c.Skills) })
                .OrderByDescending(x => x.Score)
                .Take(6)
                .Select(x => x.Course)
                .ToList();

            return Ok(new
            {
                jobs = scoredJobs,
                courses = scoredCourses
            });
        }
    }

    public class BreakdownItem
    {
        public string Category { get; set; } = string.Empty;
        public double Score { get; set; }
        public double Weight { get; set; }
    }

    [ApiController]
    [Route("api")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DashboardController(AppDbContext context) => _context = context;

        [HttpGet("dashboard/summary")]
        public async Task<IActionResult> GetSummary()
        {
            var totalCompanies = await _context.Companies.CountAsync();
            var totalEmployees = await _context.Employees.CountAsync();
            var totalTrainings = await _context.Trainings.CountAsync();

            var companies = await _context.Companies.ToListAsync();
            var indicators = await _context.Indicators.ToListAsync();

            var companiesBySize = new[] { "micro", "pequena", "media", "grande" }
                .Select(size => new
                {
                    size,
                    count = companies.Count(c => c.Size == size)
                })
                .ToList();

            var scores = new List<double>();
            var performerList = new List<object>();

            foreach (var c in companies)
            {
                var compIndicators = indicators.Where(i => i.CompanyId == c.Id).ToList();
                double score = ComputeOds8Score(compIndicators);
                scores.Add(score);
                performerList.Add(new { id = c.Id, name = c.Name, score });
            }

            double averageOds8Score = scores.Any() ? scores.Average() : 50;

            var topPerformers = performerList
                .Select(p => (dynamic)p)
                .OrderByDescending(p => p.score)
                .Take(5)
                .Select(p => new { id = p.id, name = p.name, score = Math.Round((double)p.score, 1) })
                .ToList();

            return Ok(new
            {
                totalCompanies,
                totalEmployees,
                totalTrainings,
                averageOds8Score = Math.Round(averageOds8Score, 1),
                companiesBySize,
                topPerformers
            });
        }

        [HttpGet("companies/{companyId}/ods8-score")]
        public async Task<IActionResult> GetOds8Score(int companyId)
        {
            var indicators = await _context.Indicators.Where(i => i.CompanyId == companyId).ToListAsync();
            var employees = await _context.Employees.Where(e => e.CompanyId == companyId).ToListAsync();
            var trainings = await _context.Trainings.Where(t => t.CompanyId == companyId).ToListAsync();

            var result = ComputeOds8ScoreDetailed(companyId, indicators, employees, trainings);
            return Ok(result);
        }

        [HttpGet("companies/{companyId}/indicator-trends")]
        public async Task<IActionResult> GetIndicatorTrends(int companyId)
        {
            var trends = await _context.Indicators
                .Where(i => i.CompanyId == companyId)
                .OrderBy(i => i.Period)
                .Select(i => new { period = i.Period, category = i.Category, value = i.Value })
                .ToListAsync();

            return Ok(trends);
        }

        [HttpGet("companies/{companyId}/diversity-breakdown")]
        public async Task<IActionResult> GetDiversityBreakdown(int companyId)
        {
            var employees = await _context.Employees.Where(e => e.CompanyId == companyId).ToListAsync();
            int total = employees.Count;

            var genders = new[] { "masculino", "feminino", "outro", "nao_informado" };
            var genderDistribution = genders.Select(gender =>
            {
                int count = employees.Count(e => e.Gender == gender);
                double percentage = total > 0 ? Math.Round(((double)count / total) * 100, 1) : 0;
                return new { gender, count, percentage };
            }).ToList();

            var ageGroups = new[]
            {
                new { group = "18-24", min = 18, max = 24 },
                new { group = "25-34", min = 25, max = 34 },
                new { group = "35-44", min = 35, max = 44 },
                new { group = "45-54", min = 45, max = 54 },
                new { group = "55+", min = 55, max = 999 }
            }.Select(g => new
            {
                group = g.group,
                count = employees.Count(e => e.Age >= g.min && e.Age <= g.max)
            }).ToList();

            int formalCount = employees.Count(e => e.FormalContract);
            double formalContractRate = total > 0 ? Math.Round(((double)formalCount / total) * 100, 1) : 0;

            return Ok(new { genderDistribution, ageGroups, formalContractRate });
        }

        private double ComputeOds8Score(List<Indicator> indicators)
        {
            var categories = new[] { "salario", "jornada", "rotatividade", "saude_seguranca", "diversidade", "capacitacao", "trabalho_infantil", "formalidade" };
            double total = 0;
            int count = 0;
            foreach (var cat in categories)
            {
                var items = indicators.Where(i => i.Category == cat).ToList();
                if (items.Any())
                {
                    double avg = items.Average(i => i.Value);
                    total += Math.Min(avg, 100);
                    count++;
                }
            }
            return count > 0 ? total / count : 50;
        }

        private object ComputeOds8ScoreDetailed(
            int companyId,
            List<Indicator> indicators,
            List<Employee> employees,
            List<Training> trainings)
        {
            var categoryWeights = new Dictionary<string, double>
            {
                { "salario", 0.20 },
                { "jornada", 0.15 },
                { "rotatividade", 0.12 },
                { "saude_seguranca", 0.15 },
                { "diversidade", 0.12 },
                { "capacitacao", 0.10 },
                { "trabalho_infantil", 0.08 },
                { "formalidade", 0.08 }
            };

            var breakdown = new List<BreakdownItem>();
            double weightedSum = 0;
            double totalWeight = 0;

            foreach (var kvp in categoryWeights)
            {
                string cat = kvp.Key;
                double w = kvp.Value;
                var items = indicators.Where(i => i.Category == cat).ToList();
                double score = 50;

                if (items.Any())
                {
                    double avgVal = items.Average(i => i.Value);
                    score = Math.Clamp(avgVal, 0, 100);
                }
                else if (cat == "formalidade" && employees.Any())
                {
                    double formalCount = employees.Count(e => e.FormalContract);
                    score = (formalCount / employees.Count) * 100;
                }
                else if (cat == "capacitacao" && trainings.Any())
                {
                    score = Math.Min(trainings.Count * 10.0, 100.0);
                }
                else if (cat == "diversidade" && employees.Any())
                {
                    int uniqueGenders = employees.Select(e => e.Gender).Distinct().Count();
                    score = Math.Min(uniqueGenders * 25.0, 100.0);
                }

                var item = new BreakdownItem { Category = cat, Score = Math.Round(score, 1), Weight = w };
                breakdown.Add(item);
                weightedSum += score * w;
                totalWeight += w;
            }

            double overallScore = totalWeight > 0 ? Math.Round(weightedSum / totalWeight, 1) : 50;

            string level = overallScore switch
            {
                >= 85 => "excelente",
                >= 70 => "bom",
                >= 50 => "regular",
                >= 30 => "insuficiente",
                _ => "critico"
            };

            var recommendations = new List<string>();
            var weakCats = breakdown.Where(b => b.Score < 60).OrderBy(b => b.Score).ToList();

            if (!weakCats.Any())
            {
                recommendations.Add("Excelente desempenho! Continue monitorando os indicadores regularmente.");
            }
            else
            {
                foreach (var cat in weakCats.Take(4))
                {
                    string rec = cat.Category switch
                    {
                        "salario" => "Revise a política salarial para garantir salários acima do mínimo regional e equidade entre gêneros.",
                        "jornada" => "Reduza horas extras e promova jornadas flexíveis alinhadas à legislação trabalhista.",
                        "rotatividade" => "Invista em programs de retenção de talentos e pesquisas de clima organizacional.",
                        "saude_seguranca" => "Implemente treinamentos de segurança do trabalho e revise os EPIs disponibilizados.",
                        "diversidade" => "Adote processos seletivos inclusivos e metas de diversidade por gênero, etnia e faixa etária.",
                        "capacitacao" => "Aumente as horas de treinamento por funcionário e diversifique os temas dos programas.",
                        "trabalho_infantil" => "Reforce auditorias na cadeia de fornecimento e implemente política de tolerância zero.",
                        "formalidade" => "Formalize todos os contratos de trabalho e elimine relações de trabalho informais.",
                        _ => $"Melhore o indicador de {cat.Category}."
                    };
                    recommendations.Add(rec);
                }
            }

            return new
            {
                companyId,
                overallScore,
                level,
                breakdown = breakdown.Select(b => new { category = b.Category, score = b.Score, weight = b.Weight }),
                recommendations
            };
        }
    }
}
