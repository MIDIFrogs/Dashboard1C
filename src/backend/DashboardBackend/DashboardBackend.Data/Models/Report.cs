// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
namespace DashboardBackend.Data.Models
{
    public class Report
    {
        public int Id { get; set; }
        public int Year { get; set; }
        public int Quarter { get; set; }
        public ICollection<Sale> Sales { get; set; } = [];
    }
}