using Microsoft.EntityFrameworkCore;
using TrabalhoJusto.Api.Models;

namespace TrabalhoJusto.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Company> Companies { get; set; } = null!;
        public DbSet<Indicator> Indicators { get; set; } = null!;
        public DbSet<Employee> Employees { get; set; } = null!;
        public DbSet<Training> Trainings { get; set; } = null!;
        public DbSet<Resume> Resumes { get; set; } = null!;
        public DbSet<Job> Jobs { get; set; } = null!;
        public DbSet<Course> Courses { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Session> Sessions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Session>()
                .HasIndex(s => s.Expire)
                .HasDatabaseName("IDX_session_expire");

            if (Database.ProviderName?.Contains("PostgreSQL") == true)
            {
                modelBuilder.Entity<User>()
                    .Property(u => u.Id)
                    .HasDefaultValueSql("gen_random_uuid()");

                modelBuilder.Entity<Session>()
                    .Property(s => s.Sess)
                    .HasColumnType("jsonb");
            }
            else
            {
                modelBuilder.Entity<User>()
                    .Property(u => u.Id)
                    .HasDefaultValueSql("lower(hex(randomblob(16)))");
            }
        }
    }
}
