// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
using System.Text.RegularExpressions;
using DashboardBackend.Core.Transfer;
using DashboardBackend.Data.Access;
using DashboardBackend.Data.Models;
using OfficeOpenXml;

namespace DashboardBackend.Core
{
    public partial class ReportService(ICategoryRepository categoryRepository, IProductGroupRepository productGroupRepository, IReportRepository reportRepository, ISaleRepository saleRepository)
    {
        private static readonly Regex YearFormatRegex = GetYearFormatRegex();

        public async Task ImportReportFromExcelAsync(Stream file)
        {
            using var package = new ExcelPackage(file);
            foreach (var sheet in package.Workbook.Worksheets)
            {
                // TODO: Add info from the page
                if (!TryParseReportString(sheet.Name, out int year, out int quarter))
                    continue;
                var categories = new List<CategoryDto>();
                var products = new List<ProductGroupDto>();
                var report = new ReportDto();
                var sales = new List<SaleDto>();

                int i = 0;
                string startRowCatNumber = "11";
                while (sheet.Cells["A" + startRowCatNumber].Rows > 1) // replace
                {
                    categories[i].Name = sheet.Cells["A" + startRowCatNumber].Value.ToString();
                    categories[i].Weight = (sheet.Cells["B" + startRowCatNumber].Value as decimal?) ?? 0;

                    string startRowPrNumber = startRowCatNumber;
                    int j = 0;
                    while (!sheet.Cells["C" + startRowPrNumber].Value.ToString().Contains(':')) // replace
                    {
                        products[j].Name = sheet.Cells["C" + startRowPrNumber].Value.ToString();
                        products[j].Region = "-".ToString();
                        categories[i].ProductIds.Add(j);
                        products[j].CategoryId = i;

                        sales[j].TargetAmount = (sheet.Cells["F" + startRowPrNumber].Value as decimal?) ?? 0;
                        sales[j].ActualSales = (sheet.Cells["F" + $"{int.Parse(startRowPrNumber) + 1}"].Value as decimal?) ?? 0;
                        sales[j].ProductId = j;
                        sales[j].ReportId = 0;
                        // products[j].CompletePercent = ActualSales/TargetAmount;

                        j++;
                        startRowPrNumber = $"{int.Parse(startRowPrNumber) + sheet.Cells["C" + startRowPrNumber].Rows}";
                    }
                    // categories[i].GeneralCompletePercent = ActualSales[j-е]/TargetAmount[j-е]
                    // categories[i].CompleteTasks = products.Count(ActualSales/TargetAmount > 1);
                    //if (categories[i].CompleteTasks == products.Count)
                    //    categories[i].Award = categories[i].Weight;
                    // else categories[i].Award = (decimal)0;

                    i++;
                    startRowCatNumber = $"{int.Parse(startRowCatNumber)+sheet.Cells["A"+startRowCatNumber].Rows}";
                }

                report.Year = year;
                report.Quarter = quarter;

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