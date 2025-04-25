using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DashboardBackend.Data.Access;
using DashboardBackend.Data.Models;

namespace DashboardBackend.Core
{
    public class StatisticsService(IReportRepository reportRepository, ICategoryRepository categoryRepository, IProductGroupRepository productsRepository)
    {
        public async Task<decimal> CalculateCrossRebateAsync(int year, int quarter)
        {
            throw new NotImplementedException();
        }

        public async Task<decimal> CalculatePointsAsync(int year, int quarter)
        {
            throw new NotImplementedException();
        }

        public async Task<decimal> CalculatePointsAsync(Category category, int year, int quarter)
        {
            throw new NotImplementedException();
        }

        public async Task<decimal> CalculateCompletionProgressAsync(ProductGroup product, int year, int quarter)
        {
            throw new NotImplementedException();
        }

        public async Task<int> CountCompletedAsync(Category category, int year, int quarter)
        {
            throw new NotImplementedException();
        }

        public async Task<decimal> CalculateCompletionProgressAsync(Category category, int year, int quarter)
        {
            throw new NotImplementedException();
        }
    }
}
