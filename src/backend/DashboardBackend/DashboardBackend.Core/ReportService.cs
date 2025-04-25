// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
using DashboardBackend.Core.Transfer;
using DashboardBackend.Data.Access;
using DashboardBackend.Data.Models;

namespace DashboardBackend.Core
{
    public class ReportService(IReportRepository reportRepository, ISaleRepository saleRepository)
    {
        public async Task UploadReportAsync(ReportDto reportDto)
        {
            var report = await reportRepository.GetByIdAsync(reportDto.Id);
            if (report == null)
            {
                report = new Report()
                {
                    Quarter = reportDto.Quarter,
                    Year = reportDto.Year,
                };
                await reportRepository.AddAsync(report);
            }

            // Create or update logic
            foreach (var saleDto in reportDto.Sales)
            {
                var sale = await saleRepository.GetByIdAsync(saleDto.Id);
                if (sale != null)
                {
                    // Update existing sale
                    sale.TargetAmount = saleDto.TargetAmount;
                    sale.ActualSales = saleDto.ActualSales;
                    await saleRepository.UpdateAsync(sale);
                }
                else
                {
                    // Create new sale
                    var newSale = new Sale
                    {
                        ProductId = saleDto.ProductId,
                        ReportId = report.Id,
                        TargetAmount = saleDto.TargetAmount,
                        ActualSales = saleDto.ActualSales
                    };
                    await saleRepository.AddAsync(newSale);
                }
            }
        }
    }
}