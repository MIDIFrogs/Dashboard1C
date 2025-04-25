// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
using DashboardBackend.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace DashboardBackend.Data.Access
{
    internal class ProductGroupRepository(DashboardDbContext context) : IProductGroupRepository
    {
        public async Task<IEnumerable<ProductGroup>> GetAllAsync(int skip = 0, int take = 10)
        {
            return await context.Products.Include(pg => pg.Sales).Skip(skip).Take(take).ToListAsync();
        }

        public async Task<ProductGroup?> GetByIdAsync(int id)
        {
            return await context.Products.Include(pg => pg.Sales).FirstOrDefaultAsync(pg => pg.Id == id);
        }

        public async Task AddAsync(ProductGroup productGroup)
        {
            await context.Products.AddAsync(productGroup);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ProductGroup productGroup)
        {
            context.Products.Update(productGroup);
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var productGroup = await GetByIdAsync(id);
            if (productGroup != null)
            {
                context.Products.Remove(productGroup);
                await context.SaveChangesAsync();
            }
        }

        public async Task<ProductGroup?> GetProductGroupByNameAsync(string name)
        {
            return await context.Products.FirstOrDefaultAsync(pg => pg.Name == name);
        }
    }
}