﻿// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
using System.ComponentModel.DataAnnotations;

namespace DashboardBackend.Data.Models
{
    public class Category
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public decimal Weight { get; set; }
        public ICollection<ProductGroup> Products { get; set; } = [];
    }
}