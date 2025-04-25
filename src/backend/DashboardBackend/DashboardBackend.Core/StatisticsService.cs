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

        public async Task<decimal> CalculateCategoryPointsAsync(int categoryId, int year, int quarter)
        {
            throw new NotImplementedException();
        }

        public async Task<decimal> CalculateProductCompletionProgressAsync(int productId, int year, int quarter)
        {
            var product = await productsRepository.GetByIdAsync(productId);
            var report = await reportRepository.GetByDateAsync(year, quarter);
            if (product == null)
                return 0;
            var sells = product.Sales.Where(sale => sale.Report == report);
            return sells.Average(x => x.ActualSales / x.TargetAmount);
        }

        public async Task<int> CountCategoryCompletedAsync(int categoryId, int year, int quarter)
        {
            throw new NotImplementedException();
        }

        public async Task<decimal> CalculateCategoryCompletionProgressAsync(int categoryId, int year, int quarter)
        {
            throw new NotImplementedException();
        }
    }
}
