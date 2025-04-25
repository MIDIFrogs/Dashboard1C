using DashboardBackend.Core.Transfer;
using DashboardBackend.Data.Access;
using DashboardBackend.Data.Models;
using Microsoft.AspNetCore.Mvc;

namespace DashboardBackend.Api.Controllers
{
    /// <summary>
    /// Controller for managing product groups.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class ProductsController(IProductGroupRepository productsRepository) : ControllerBase
    {
        /// <summary>
        /// Retrieves a list of product groups with pagination support.
        /// </summary>
        /// <param name="skip">The number of records to skip.</param>
        /// <param name="take">The number of records to return.</param>
        /// <returns>A list of product groups.</returns>
        [HttpGet]
        public async Task<IActionResult> GetProductGroups(int skip = 0, int take = 10)
        {
            var productGroups = await productsRepository.GetAllAsync(skip, take);
            var productGroupDtos = productGroups.Select(DtoMapper.ToDto).ToList();
            return Ok(productGroupDtos);
        }

        /// <summary>
        /// Retrieves a product group by its identifier.
        /// </summary>
        /// <param name="id">The identifier of the product group.</param>
        /// <returns>The details of the product group.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductGroup(int id)
        {
            var productGroup = await productsRepository.GetByIdAsync(id);
            if (productGroup == null)
            {
                return NotFound();
            }

            var productGroupDto = productGroup.ToDto();
            return Ok(productGroupDto);
        }

        /// <summary>
        /// Creates a new product group.
        /// </summary>
        /// <param name="productGroupDto">The data for creating the product group.</param>
        /// <returns>The created product group.</returns>
        [HttpPost]
        public async Task<IActionResult> CreateProductGroup([FromBody] ProductGroupDto productGroupDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var productGroup = new ProductGroup
            {
                Name = productGroupDto.Name,
                Region = productGroupDto.Region,
                CategoryId = productGroupDto.CategoryId
            };

            await productsRepository.AddAsync(productGroup);
            return CreatedAtAction(nameof(GetProductGroup), new { id = productGroup.Id }, productGroup.ToDto());
        }

        /// <summary>
        /// Updates an existing product group.
        /// </summary>
        /// <param name="id">The identifier of the product group.</param>
        /// <param name="productGroupDto">The data for updating the product group.</param>
        /// <returns>The result of the operation.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductGroup(int id, [FromBody] ProductGroupDto productGroupDto)
        {
            if (id != productGroupDto.Id)
            {
                return BadRequest("ProductGroup ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingProductGroup = await productsRepository.GetByIdAsync(id);
            if (existingProductGroup == null)
            {
                return NotFound();
            }

            existingProductGroup.Name = productGroupDto.Name;
            existingProductGroup.CategoryId = productGroupDto.CategoryId;
            existingProductGroup.Region = productGroupDto.Region;

            await productsRepository.UpdateAsync(existingProductGroup);
            return NoContent(); // 204 No Content
        }

        /// <summary>
        /// Deletes a product group by its identifier.
        /// </summary>
        /// <param name="id">The identifier of the product group.</param>
        /// <returns>The result of the operation.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductGroup(int id)
        {
            var existingProductGroup = await productsRepository.GetByIdAsync(id);
            if (existingProductGroup == null)
            {
                return NotFound();
            }

            await productsRepository.DeleteAsync(id);
            return NoContent(); // 204 No Content
        }
    }
}
