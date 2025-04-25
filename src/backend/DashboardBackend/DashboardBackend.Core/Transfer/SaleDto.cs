using System.ComponentModel.DataAnnotations;

namespace DashboardBackend.Core.Transfer
{
    /// <summary>
    /// Represents a data transfer object for a sale.
    /// </summary>
    public class SaleDto
    {
        /// <summary>
        /// Gets or sets the unique identifier for the sale.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the unique identifier for the product associated with the sale.
        /// This field is required.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the ProductId is not provided.</exception>
        [Required(ErrorMessage = "ProductId is required.")]
        public int ProductId { get; set; }

        /// <summary>
        /// Gets or sets the unique identifier for the report associated with the sale.
        /// This field is required.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the ReportId is not provided.</exception>
        [Required(ErrorMessage = "ReportId is required.")]
        public int ReportId { get; set; }

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
