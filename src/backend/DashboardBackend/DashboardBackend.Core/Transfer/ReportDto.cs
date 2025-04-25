// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
using System.ComponentModel.DataAnnotations;

namespace DashboardBackend.Core.Transfer
{
    /// <summary>
    /// Represents a data transfer object for a report.
    /// </summary>
    public class ReportDto
    {
        /// <summary>
        /// Gets or sets the unique identifier for the report.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the year of the report.
        /// This field is required and must be between 1900 and 10000.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the year is not in the valid range.</exception>
        [Required(ErrorMessage = "Year is required.")]
        [Range(1900, 10000, ErrorMessage = "Year must be between 1900 and 10000.")]
        public int Year { get; set; }

        /// <summary>
        /// Gets or sets the quarter of the report.
        /// This field is required and must be between 1 and 4.
        /// </summary>
        /// <exception cref="ValidationException">Thrown when the quarter is not in the valid range.</exception>
        [Required(ErrorMessage = "Year is required.")]
        [Range(1900, 10000, ErrorMessage = "Year must be between 1900 and 10000.")]
        public int Quarter { get; set; }

        /// <summary>
        /// Gets or sets the list of sales associated with the report.
        /// </summary>
        /// <value>
        /// A list of integers representing the sales.
        /// </value>
        public List<SaleDto> Sales { get; set; } = [];
    }
}