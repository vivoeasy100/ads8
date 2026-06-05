using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TrabalhoJusto.Api.Models
{
    [Table("companies")]
    public class Company
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("sector")]
        public string Sector { get; set; } = string.Empty;

        [Required]
        [Column("size")]
        public string Size { get; set; } = string.Empty; // micro, pequena, media, grande

        [Required]
        [Column("city")]
        public string City { get; set; } = string.Empty;

        [Required]
        [Column("state")]
        public string State { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("indicators")]
    public class Indicator
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("company_id")]
        public int CompanyId { get; set; }

        [Required]
        [Column("category")]
        public string Category { get; set; } = string.Empty;

        [Column("value")]
        public double Value { get; set; }

        [Required]
        [Column("unit")]
        public string Unit { get; set; } = string.Empty;

        [Required]
        [Column("period")]
        public string Period { get; set; } = string.Empty;

        [Column("notes")]
        public string? Notes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("employees")]
    public class Employee
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("company_id")]
        public int CompanyId { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("role")]
        public string Role { get; set; } = string.Empty;

        [Required]
        [Column("gender")]
        public string Gender { get; set; } = string.Empty; // masculino, feminino, outro, nao_informado

        [Column("age")]
        public int Age { get; set; }

        [Column("salary")]
        public double Salary { get; set; }

        [Column("formal_contract")]
        public bool FormalContract { get; set; } = true;

        [Column("hired_at")]
        public DateTime HiredAt { get; set; } = DateTime.UtcNow;

        [Column("dismissed_at")]
        public DateTime? DismissedAt { get; set; }
    }

    [Table("trainings")]
    public class Training
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("company_id")]
        public int CompanyId { get; set; }

        [Required]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Column("type")]
        public string Type { get; set; } = string.Empty;

        [Column("hours_total")]
        public double HoursTotal { get; set; }

        [Column("participants_count")]
        public int ParticipantsCount { get; set; }

        [Column("completed_at")]
        public DateTime? CompletedAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("resumes")]
    public class Resume
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column("phone")]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [Column("city")]
        public string City { get; set; } = string.Empty;

        [Required]
        [Column("state")]
        public string State { get; set; } = string.Empty;

        [Column("linkedin_url")]
        public string? LinkedinUrl { get; set; }

        [Column("summary")]
        public string Summary { get; set; } = string.Empty;

        [Column("experiences")]
        public string Experiences { get; set; } = "[]"; // JSON string

        [Column("education")]
        public string Education { get; set; } = "[]"; // JSON string

        [Column("skills")]
        public string Skills { get; set; } = "[]"; // JSON string

        [Column("languages")]
        public string Languages { get; set; } = "[]"; // JSON string

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("jobs")]
    public class Job
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Column("company")]
        public string Company { get; set; } = string.Empty;

        [Required]
        [Column("location")]
        public string Location { get; set; } = string.Empty;

        [Column("type")]
        public string Type { get; set; } = "clt";

        [Required]
        [Column("area")]
        public string Area { get; set; } = string.Empty;

        [Column("salary_min")]
        public int? SalaryMin { get; set; }

        [Column("salary_max")]
        public int? SalaryMax { get; set; }

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Column("requirements")]
        public string Requirements { get; set; } = "[]"; // JSON string

        [Column("skills")]
        public string Skills { get; set; } = "[]"; // JSON string

        [Column("benefits")]
        public string Benefits { get; set; } = "[]"; // JSON string

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("courses")]
    public class Course
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Column("provider")]
        public string Provider { get; set; } = string.Empty;

        [Required]
        [Column("area")]
        public string Area { get; set; } = string.Empty;

        [Column("level")]
        public string Level { get; set; } = "iniciante";

        [Column("duration_hours")]
        public int? DurationHours { get; set; }

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Column("skills")]
        public string Skills { get; set; } = "[]"; // JSON string

        [Column("url")]
        public string? Url { get; set; }

        [Column("is_free")]
        public string IsFree { get; set; } = "true";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Column("email")]
        public string? Email { get; set; }

        [Column("first_name")]
        public string? FirstName { get; set; }

        [Column("last_name")]
        public string? LastName { get; set; }

        [Column("profile_image_url")]
        public string? ProfileImageUrl { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("sessions")]
    public class Session
    {
        [Key]
        [Column("sid")]
        public string Sid { get; set; } = string.Empty;

        [Required]
        [Column("sess")]
        public string Sess { get; set; } = string.Empty;

        [Column("expire")]
        public DateTime Expire { get; set; }
    }
}
