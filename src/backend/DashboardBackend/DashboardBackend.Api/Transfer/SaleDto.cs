using System.ComponentModel.DataAnnotations;

namespace DashboardBackend.Api.Transfer
{
    /// <summary>
    /// Represents a data transfer object for a sale.
    /// </summary>
    public class SaleDto
    {
        /// <summary>
        /// Gets or sets the unique identifier for the sale.
        /// </summary>
        public int SaleId { get; set; }

        /// <summary>
        /// Gets or sets the year of the sale.
        /// This field is required and must be between 1900 and 10000.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the year is not in the valid range.</exception>
        [Required(ErrorMessage = "Year is required.")]
        [Range(1900, 10000, ErrorMessage = "Year must be between 1900 and 10000.")]
        public int Year { get; set; }

        /// <summary>
        /// Gets or sets the quarter of the year for the sale.
        /// This field is required and must be between 1 and 4.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the quarter is not in the valid range.</exception>
        [Required(ErrorMessage = "Quarter is required.")]
        [Range(1, 4, ErrorMessage = "Quarter must be between 1 and 4.")]
        public int Quarter { get; set; }

        /// <summary>
        /// Gets or sets the unique identifier for the product associated with the sale.
        /// This field is required.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the ProductId is not provided.</exception>
        [Required(ErrorMessage = "ProductId is required.")]
        public int ProductId { get; set; }

        /// <summary>
        /// Gets or sets the target amount for the sale.
        /// This field must be a positive value.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the TargetAmount is negative.</exception>
        [Range(0, double.MaxValue, ErrorMessage = "TargetAmount must be a positive value.")]
        public decimal TargetAmount { get; set; }

        /// <summary>
        /// Gets or sets the actual sales amount.
        /// This field must be a positive value.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the ActualSales is negative.</exception>
        [Range(0, double.MaxValue, ErrorMessage = "ActualSales must be a positive value.")]
        public decimal ActualSales { get; set; }
    }

}
