using DashboardBackend.Data.Models;

namespace DashboardBackend.Api.Transfer
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
                Products = [.. category.Products.Select(ToDto)]
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
                CategoryId = productGroup.CategoryId,
                Sales = [.. productGroup.Sales.Select(ToDto)]
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
