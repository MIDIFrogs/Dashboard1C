using DashboardBackend.Core;
using DashboardBackend.Core.Transfer;
using DashboardBackend.Data.Access;
using Microsoft.AspNetCore.Mvc;

namespace DashboardBackend.Api.Controllers
{
    /// <summary>
    /// Controller for managing reports.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class ReportsController(IReportRepository reportsRepository, ReportService reportsService) : ControllerBase
    {
        /// <summary>
        /// Retrieves a list of reports with pagination support.
        /// </summary>
        /// <param name="skip">The number of records to skip.</param>
        /// <param name="take">The number of records to return.</param>
        /// <returns>A list of reports.</returns>
        [HttpGet]
        public async Task<IActionResult> GetReports(int skip = 0, int take = 10)
        {
            var reports = await reportsRepository.GetAllAsync(skip, take);
            var reportDtos = reports.Select(DtoMapper.ToDto).ToList();
            return Ok(reportDtos);
        }

        /// <summary>
        /// Retrieves a report by its identifier.
        /// </summary>
        /// <param name="id">The identifier of the report.</param>
        /// <returns>The details of the report.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReport(int id)
        {
            var report = await reportsRepository.GetByIdAsync(id);
            if (report == null)
            {
                return NotFound();
            }

            var reportDto = report.ToDto();
            return Ok(reportDto);
        }

        /// <summary>
        /// Uploads a report.
        /// </summary>
        /// <param name="reportDto">The data for creating the report.</param>
        /// <returns>The created report.</returns>
        [HttpPost]
        public async Task<IActionResult> AddOrUpdateReport([FromBody] ReportDto reportDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await reportsService.UploadReportAsync(reportDto);
            return CreatedAtAction(nameof(GetReport), new { id = reportDto.Id }, reportDto);
        }

        /// <summary>
        /// Uploads a report from an Excel file.
        /// </summary>
        /// <param name="file">The Excel file to upload.</param>
        /// <returns>The result of the operation.</returns>
        [HttpPost("import")]
        public async Task<IActionResult> UploadReportFromExcel([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Проверка на тип файла (например, .xlsx)
            if (!Path.GetExtension(file.FileName).Equals(".xlsx", StringComparison.CurrentCultureIgnoreCase))
            {
                return BadRequest("Invalid file type. Please upload an Excel file.");
            }

            try
            {
                await reportsService.ImportReportFromExcelAsync(file.OpenReadStream());
                return Ok("Report uploaded successfully.");
            }
            catch (Exception ex)
            {
                // Логирование ошибки (если необходимо)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Deletes a report by its identifier.
        /// </summary>
        /// <param name="id">The identifier of the report.</param>
        /// <returns>The result of the operation.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            var existingReport = await reportsRepository.GetByIdAsync(id);
            if (existingReport == null)
            {
                return NotFound();
            }

            await reportsRepository.DeleteAsync(id);
            return NoContent(); // 204 No Content
        }
    }
}
