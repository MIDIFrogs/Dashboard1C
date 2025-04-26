using DashboardBackend.Core.Transfer;
using DashboardBackend.Data.Access;
using DashboardBackend.Data.Models;
using Microsoft.AspNetCore.Mvc;

namespace DashboardBackend.Api.Controllers
{
    /// <summary>
    /// Controller for managing sales.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class SalesController(ISaleRepository salesRepository) : ControllerBase
    {
        /// <summary>
        /// Retrieves a list of sales with pagination support.
        /// </summary>
        /// <param name="skip">The number of records to skip.</param>
        /// <param name="take">The number of records to return.</param>
        /// <returns>A list of sales.</returns>
        [HttpGet]
        public async Task<IActionResult> GetSales(int skip = 0, int take = 10)
        {
            var sales = await salesRepository.GetAllAsync(skip, take);
            var saleDtos = sales.Select(DtoMapper.ToDto).ToList();
            return Ok(saleDtos);
        }

        /// <summary>
        /// Retrieves a sale by its identifier.
        /// </summary>
        /// <param name="id">The identifier of the sale.</param>
        /// <returns>The details of the sale.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSale(int id)
        {
            var sale = await salesRepository.GetByIdAsync(id);
            if (sale == null)
            {
                return NotFound();
            }

            var saleDto = sale.ToDto();
            return Ok(saleDto);
        }

        /// <summary>
        /// Creates a new sale.
        /// </summary>
        /// <param name="saleDto">The data for creating the sale.</param>
        /// <returns>The created sale.</returns>
        [HttpPost]
        public async Task<IActionResult> CreateSale([FromBody] SaleDto saleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sale = new Sale
            {
                ProductId = saleDto.ProductId,
                ReportId = saleDto.ReportId,
                TargetAmount = saleDto.TargetAmount,
                ActualSales = saleDto.ActualSales
            };

            await salesRepository.AddAsync(sale);
            return CreatedAtAction(nameof(GetSale), new { saleId = sale.Id }, sale.ToDto());
        }

        /// <summary>
        /// Updates an existing sale.
        /// </summary>
        /// <param name="id">The identifier of the sale.</param>
        /// <param name="saleDto">The data for updating the sale.</param>
        /// <returns>The result of the operation.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSale(int id, [FromBody] SaleDto saleDto)
        {
            if (id != saleDto.Id)
            {
                return BadRequest("Sale ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingSale = await salesRepository.GetByIdAsync(id);
            if (existingSale == null)
            {
                return NotFound();
            }

            existingSale.ProductId = saleDto.ProductId;
            existingSale.ReportId = saleDto.ReportId;
            existingSale.TargetAmount = saleDto.TargetAmount;
            existingSale.ActualSales = saleDto.ActualSales;

            await salesRepository.UpdateAsync(existingSale);
            return NoContent(); // 204 No Content
        }

        /// <summary>
        /// Deletes a sale by its identifier.
        /// </summary>
        /// <param name="id">The identifier of the sale.</param>
        /// <returns>The result of the operation.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            var existingSale = await salesRepository.GetByIdAsync(id);
            if (existingSale == null)
            {
                return NotFound();
            }

            await salesRepository.DeleteAsync(id);
            return NoContent(); // 204 No Content
        }
    }

}
