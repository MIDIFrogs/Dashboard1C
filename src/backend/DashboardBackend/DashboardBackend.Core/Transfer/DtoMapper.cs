using DashboardBackend.Data.Models;

namespace DashboardBackend.Core.Transfer
{
    /// <summary>
    /// Provides extension methods for mapping domain entities to data transfer objects (DTOs).
    /// </summary>
    public static class DtoMapper
    {
        /// <summary>
        /// Maps a <see cref="Category"/> entity to a <see cref="CategoryDto"/> data transfer object.
        /// </summary>
        /// <param name="category">The category entity to map.</param>
        /// <returns>A <see cref="CategoryDto"/> representing the mapped category.</returns>
        public static CategoryDto ToDto(this Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Weight = category.Weight,
                ProductIds = [.. category.Products.Select(x => x.Id)]
            };
        }

        /// <summary>
        /// Maps a <see cref="ProductGroup"/> entity to a <see cref="ProductGroupDto"/> data transfer object.
        /// </summary>
        /// <param name="productGroup">The product group entity to map.</param>
        /// <returns>A <see cref="ProductGroupDto"/> representing the mapped product group.</returns>
        public static ProductGroupDto ToDto(this ProductGroup productGroup)
        {
            return new ProductGroupDto
            {
                Id = productGroup.Id,
                Name = productGroup.Name,
                Region = productGroup.Region,
                CategoryId = productGroup.CategoryId,
                SaleIds = [.. productGroup.Sales.Select(x => x.Id)]
            };
        }

        /// <summary>
        /// Maps a <see cref="Sale"/> entity to a <see cref="SaleDto"/> data transfer object.
        /// </summary>
        /// <param name="sale">The sale entity to map.</param>
        /// <returns>A <see cref="SaleDto"/> representing the mapped sale.</returns>
        public static SaleDto ToDto(this Sale sale)
        {
            return new SaleDto
            {
                Id = sale.Id,
                ReportId = sale.ReportId,
                ProductId = sale.ProductId,
                TargetAmount = sale.TargetAmount,
                ActualSales = sale.ActualSales
            };
        }

        /// <summary>
        /// Maps a <see cref="Report"/> entity to a <see cref="ReportDto"/> data transfer object.
        /// </summary>
        /// <param name="report">The report entity to map.</param>
        /// <returns>A <see cref="ReportDto"/> representing the mapped report.</returns>
        public static ReportDto ToDto(this Report report)
        {
            return new ReportDto
            {
                Id = report.Id,
                Quarter = report.Quarter,
                Year = report.Year,
                Sales = [.. report.Sales.Select(ToDto)]
            };
        }
    }
}
