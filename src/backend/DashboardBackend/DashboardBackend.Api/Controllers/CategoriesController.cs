using DashboardBackend.Api.Transfer;
using DashboardBackend.Data.Access;
using DashboardBackend.Data.Models;
using Microsoft.AspNetCore.Mvc;

namespace DashboardBackend.Api.Controllers
{
    /// <summary>
    /// Controller for managing categories.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class CategoriesController(ICategoryRepository categoryRepository) : ControllerBase
    {
        /// <summary>
        /// Retrieves a list of categories with pagination support.
        /// </summary>
        /// <param name="skip">The number of records to skip.</param>
        /// <param name="take">The number of records to return.</param>
        /// <returns>A list of categories.</returns>
        [HttpGet]
        public async Task<IActionResult> GetCategories(int skip = 0, int take = 10)
        {
            var categories = await categoryRepository.GetAllAsync(skip, take);
            var categoryDtos = categories.Select(DtoMapper.ToDto).ToList();
            return Ok(categoryDtos);
        }

        /// <summary>
        /// Retrieves a category by its identifier.
        /// </summary>
        /// <param name="id">The identifier of the category.</param>
        /// <returns>The details of the category.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await categoryRepository.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            var categoryDto = category.ToDto();
            return Ok(categoryDto);
        }

        /// <summary>
        /// Creates a new category.
        /// </summary>
        /// <param name="categoryDto">The data for creating the category.</param>
        /// <returns>The created category.</returns>
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryDto categoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = new Category
            {
                Name = categoryDto.Name,
                Weight = categoryDto.Weight
            };

            await categoryRepository.AddAsync(category);
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category.ToDto());
        }

        /// <summary>
        /// Updates an existing category.
        /// </summary>
        /// <param name="id">The identifier of the category.</param>
        /// <param name="categoryDto">The data for updating the category.</param>
        /// <returns>The result of the operation.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryDto categoryDto)
        {
            if (id != categoryDto.Id)
            {
                return BadRequest("Category ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCategory = await categoryRepository.GetByIdAsync(id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            existingCategory.Name = categoryDto.Name;
            existingCategory.Weight = categoryDto.Weight;

            await categoryRepository.UpdateAsync(existingCategory);
            return NoContent(); // 204 No Content
        }

        /// <summary>
        /// Deletes a category by its identifier.
        /// </summary>
        /// <param name="id">The identifier of the category.</param>
        /// <returns>The result of the operation.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var existingCategory = await categoryRepository.GetByIdAsync(id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            await categoryRepository.DeleteAsync(id);
            return NoContent(); // 204 No Content
        }
    }

}
