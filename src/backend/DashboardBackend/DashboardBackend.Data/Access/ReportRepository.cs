// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
using DashboardBackend.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace DashboardBackend.Data.Access
{
    internal class ReportRepository(DashboardDbContext context) : IReportRepository
    {
        public async Task<IEnumerable<Report>> GetAllAsync(int skip = 0, int take = 10)
        {
            return await context.Reports.Include(r => r.Sales).Skip(skip).Take(take).ToListAsync();
        }

        public async Task<Report?> GetByIdAsync(int id)
        {
            return await context.Reports.Include(r => r.Sales).FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task AddAsync(Report report)
        {
            await context.Reports.AddAsync(report);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Report report)
        {
            context.Reports.Update(report);
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var report = await GetByIdAsync(id);
            if (report != null)
            {
                context.Reports.Remove(report);
                await context.SaveChangesAsync();
            }
        }
    }
}