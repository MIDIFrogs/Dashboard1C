// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
using DashboardBackend.Data.Access;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DashboardBackend.Data
{
    public static class DataExtensions
    {
        public static IServiceCollection AddDbServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<DashboardDbContext>(options => options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IProductGroupRepository, ProductGroupRepository>();
            services.AddScoped<ISaleRepository, SaleRepository>();
            return services;
        }
    }
}