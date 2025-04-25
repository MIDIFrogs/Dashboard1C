using System.ComponentModel.DataAnnotations;

namespace DashboardBackend.Api.Transfer
{
    public class CategoryDto
    {
        public int Id { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Range(0, 100, ErrorMessage = "Weight must be between 0 and 100.")]
        public decimal Weight { get; set; }

        public List<ProductGroupDto> Products { get; set; } = [];
    }
}
