// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
namespace DashboardBackend.Data.Models
{
    public class Sale
    {
        public int SaleId { get; set; }
        public int Year { get; set; }
        public int Quarter { get; set; }
        public int ProductId { get; set; }
        public ProductGroup Product { get; set; }
        public decimal TargetAmount { get; set; }
        public decimal ActualSales { get; set; }
    }
}