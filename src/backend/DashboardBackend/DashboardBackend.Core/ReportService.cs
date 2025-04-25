// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
using System.Text.RegularExpressions;
using DashboardBackend.Core.Transfer;
using DashboardBackend.Data.Access;
using DashboardBackend.Data.Models;
using OfficeOpenXml;

namespace DashboardBackend.Core
{
    public partial class ReportService(IReportRepository reportRepository, ISaleRepository saleRepository)
    {
        private static readonly Regex YearFormatRegex = GetYearFormatRegex();

        public async Task ImportReportFromExcelAsync(Stream file)
        {
            using var package = new ExcelPackage(file);
            foreach (var sheet in package.Workbook.Worksheets)
            {
                var report = new ReportDto();
                if (!TryParseReportString(sheet.Name, out int year, out int quarter))
                    continue;
                report.Year = year;
                report.Quarter = quarter;

                // TODO: Add info from the page

                await UploadReportAsync(report);
            }
        }

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

        private static bool TryParseReportString(string input, out int year, out int quarter)
        {
            // Year search regex
            var match = YearFormatRegex.Match(input);
            
            quarter = 0;
            year = 0;

            if (match.Success)
            {
                if (match.Groups[1].Success && match.Groups[2].Success) // Sales Q<Quarter> <Year>
                {
                    quarter = int.Parse(match.Groups[1].Value);
                    year = int.Parse(match.Groups[2].Value);
                }
                else if (match.Groups[3].Success && match.Groups[4].Success) // <Year>Q<Quarter>
                {
                    year = int.Parse(match.Groups[3].Value);
                    quarter = int.Parse(match.Groups[4].Value);
                }
                else if (match.Groups[5].Success && match.Groups[6].Success) // Y<ShortYear>Q<Quarter>
                {
                    year = int.Parse(match.Groups[5].Value) + 2000;
                    quarter = int.Parse(match.Groups[6].Value);
                }

                return true;
            }

            return false;
        }

        [GeneratedRegex(@"(?:Sales\s+Q(\d)\s+(\d{4})|(\d{4})Q(\d)|Y(\d{2})Q(\d))")]
        private static partial Regex GetYearFormatRegex();
    }
}