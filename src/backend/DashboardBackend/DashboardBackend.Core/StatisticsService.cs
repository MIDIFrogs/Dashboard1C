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
        public async Task<decimal> CalculatePointsAsync(int year, int quarter) // Итоговый балл
        {
            throw new NotImplementedException();
        }
        
        public async Task<decimal> CalculatePointsAsync(int categoryId, int year, int quarter)
        {
            throw new NotImplementedException();
        }

        public async Task<decimal> CalculateCrossRebateAsync(int year, int quarter) // Кросс-рибейт
        {
            throw new NotImplementedException();
        }

        public async Task<decimal> CalculateCompletionPercentAsync(int productId, int year, int quarter) // % продаж конкретного продукта
        {
            var product = await productsRepository.GetByIdAsync(productId);
            var report = await reportRepository.GetByDateAsync(year, quarter);
            if (product == null) return 0;
            var sales = product.Sales.Where(sale => sale.Report == report);
            return sales.Average(x => x.ActualSales / x.TargetAmount);
        }

        public async Task<decimal> CalculateGeneralCompletePercentAsync(int categoryId, int year, int quarter)
        {
            //var category = await categoryRepository.GetByIdAsync(categoryId);
            //var report = await reportRepository.GetByDateAsync(year, quarter);
            //if (category == null) return 0;
            //foreach (var product in category.Products)
            //{

            //}

            //return sales.Average(x => x.ActualSales / x.TargetAmount);
            throw new NotImplementedException();
        }

        public async Task<int> CountCompletedAsync(int category, int year, int quarter)
        {
            throw new NotImplementedException();
        }

    }
}
