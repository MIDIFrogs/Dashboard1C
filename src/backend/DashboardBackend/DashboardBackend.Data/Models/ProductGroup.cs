// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace DashboardBackend.Data.Models
{
    public class ProductGroup
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Region { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public ICollection<Sale> Sales { get; set; } = [];
    }
}