using System.ComponentModel.DataAnnotations;

namespace DashboardBackend.Api.Transfer
{
    public class SaleDto
    {
        public int SaleId { get; set; }

        [Required(ErrorMessage = "Year is required.")]
        [Range(1900, 10000, ErrorMessage = "Year must be between 1900 and 10000.")]
        public int Year { get; set; }

        [Required(ErrorMessage = "Quarter is required.")]
        [Range(1, 4, ErrorMessage = "Quarter must be between 1 and 4.")]
        public int Quarter { get; set; }

        [Required(ErrorMessage = "ProductId is required.")]
        public int ProductId { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "TargetAmount must be a positive value.")]
        public decimal TargetAmount { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "ActualSales must be a positive value.")]
        public decimal ActualSales { get; set; }
    }

}
