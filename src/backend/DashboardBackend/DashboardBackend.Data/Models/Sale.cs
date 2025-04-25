// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
namespace DashboardBackend.Data.Models
{
    public class Sale
    {
        public int Id { get; set; }
        public int ReportId { get; set; }
        public Report Report { get; set; }
        public int ProductId { get; set; }
        public ProductGroup Product { get; set; }
        public decimal TargetAmount { get; set; }
        public decimal ActualSales { get; set; }
    }
}