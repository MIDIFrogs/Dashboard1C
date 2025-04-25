using System.ComponentModel.DataAnnotations;

namespace DashboardBackend.Core.Transfer
{
    /// <summary>
    /// Represents a data transfer object for a product group.
    /// </summary>
    public class ProductGroupDto
    {
        /// <summary>
        /// Gets or sets the unique identifier for the product group.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the product group.
        /// This field is required and cannot be longer than 100 characters.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the name is not provided or exceeds the maximum length.</exception>
        [Required(AllowEmptyStrings = false, ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the region of the product group.
        /// This field is required and cannot be longer than 100 characters.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the region is not provided or exceeds the maximum length.</exception>
        [Required(AllowEmptyStrings = false, ErrorMessage = "Region is required.")]
        [StringLength(100, ErrorMessage = "Region cannot be longer than 100 characters.")]
        public string Region { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the unique identifier for the category associated with the product group.
        /// This field is required.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the CategoryId is not provided.</exception>
        [Required(ErrorMessage = "CategoryId is required.")]
        public int CategoryId { get; set; }

        /// <summary>
        /// Gets or sets the list of sales associated with the product group.
        /// </summary>
        public List<int> SaleIds { get; set; } = [];
    }
}
