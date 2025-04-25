// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
using DashboardBackend.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace DashboardBackend.Data
{
    internal class DashboardDbContext(DbContextOptions<DashboardDbContext> options) : DbContext(options)
    {
        public DbSet<Category> Categories { get; set; }

        public DbSet<ProductGroup> Products { get; set; }

        public DbSet<Sale> Sales { get; set; }

        public DbSet<Report> Reports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(pg => pg.Category)
                .HasForeignKey(pg => pg.CategoryId);

            modelBuilder.Entity<ProductGroup>()
                .HasMany(pg => pg.Sales)
                .WithOne(s => s.Product)
                .HasForeignKey(s => s.ProductId);

            modelBuilder.Entity<Report>()
                .HasMany(rp => rp.Sales)
                .WithOne(s => s.Report)
                .HasForeignKey(s => s.ReportId);
        }
    }
}