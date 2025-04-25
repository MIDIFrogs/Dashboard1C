// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
using DashboardBackend.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace DashboardBackend.Data.Access
{
    internal class SaleRepository(DashboardDbContext context) : ISaleRepository
    {
        public async Task<IEnumerable<Sale>> GetAllAsync(int skip = 0, int take = 10)
        {
            return await context.Sales.Include(s => s.Product).Skip(skip).Take(take).ToListAsync();
        }

        public async Task<Sale?> GetByIdAsync(int saleId)
        {
            return await context.Sales.Include(s => s.Product).FirstOrDefaultAsync(s => s.Id == saleId);
        }

        public async Task AddAsync(Sale sale)
        {
            await context.Sales.AddAsync(sale);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Sale sale)
        {
            context.Sales.Update(sale);
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int saleId)
        {
            var sale = await GetByIdAsync(saleId);
            if (sale != null)
            {
                context.Sales.Remove(sale);
                await context.SaveChangesAsync();
            }
        }
    }
}