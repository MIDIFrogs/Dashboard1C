using System.ComponentModel.DataAnnotations;

namespace DashboardBackend.Core.Transfer
{
    /// <summary>
    /// Represents a data transfer object for a category.
    /// </summary>
    public class CategoryDto
    {
        /// <summary>
        /// Gets or sets the unique identifier for the category.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the category.
        /// This field is required and cannot be longer than 100 characters.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the name is not provided or exceeds the maximum length.</exception>
        [Required(AllowEmptyStrings = false, ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the weight of the category.
        /// This field must be between 0 and 100.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the weight is not in the valid range.</exception>
        [Range(0, 100, ErrorMessage = "Weight must be between 0 and 100.")]
        public decimal Weight { get; set; }

        /// <summary>
        /// Gets or sets the list of product group IDs associated with the category.
        /// </summary>
        public List<int> ProductIds { get; set; } = [];
    }

}
