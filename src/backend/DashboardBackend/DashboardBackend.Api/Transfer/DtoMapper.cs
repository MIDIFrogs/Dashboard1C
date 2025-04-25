using DashboardBackend.Data.Models;

namespace DashboardBackend.Api.Transfer
{
    public static class DtoMapper
    {
        public static CategoryDto ToDto(this Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Weight = category.Weight,
                Products = category.Products.Select(p => ToDto(p)).ToList()
            };
        }

        public static ProductGroupDto ToDto(this ProductGroup productGroup)
        {
            return new ProductGroupDto
            {
                Id = productGroup.Id,
                Name = productGroup.Name,
                CategoryId = productGroup.CategoryId,
                Sales = productGroup.Sales.Select(s => ToDto(s)).ToList()
            };
        }

        public static SaleDto ToDto(this Sale sale)
        {
            return new SaleDto
            {
                SaleId = sale.SaleId,
                Year = sale.Year,
                Quarter = sale.Quarter,
                ProductId = sale.ProductId,
                TargetAmount = sale.TargetAmount,
                ActualSales = sale.ActualSales
            };
        }
    }
}
