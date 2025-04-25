using System.ComponentModel.DataAnnotations;

namespace DashboardBackend.Api.Transfer
{
    public class ProductGroupDto
    {
        public int Id { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "CategoryId is required.")]
        public int CategoryId { get; set; }

        public List<SaleDto> Sales { get; set; } = [];
    }
}
