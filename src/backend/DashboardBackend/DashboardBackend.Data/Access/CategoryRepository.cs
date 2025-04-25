// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
using DashboardBackend.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace DashboardBackend.Data.Access
{
    internal class CategoryRepository(DashboardDbContext context) : ICategoryRepository
    {
        public async Task<IEnumerable<Category>> GetAllAsync(int skip = 0, int take = 10)
        {
            return await context.Categories.Include(c => c.Products).Skip(skip).Take(take).ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await context.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task AddAsync(Category category)
        {
            await context.Categories.AddAsync(category);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Category category)
        {
            context.Categories.Update(category);
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var category = await GetByIdAsync(id);
            if (category != null)
            {
                context.Categories.Remove(category);
                await context.SaveChangesAsync();
            }
        }
    }
}