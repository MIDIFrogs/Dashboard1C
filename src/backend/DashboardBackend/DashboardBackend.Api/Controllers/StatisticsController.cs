using DashboardBackend.Core;
using Microsoft.AspNetCore.Mvc;

namespace DashboardBackend.Api.Controllers
{
    namespace YourNamespace.Controllers
    {
        /// <summary>
        /// Provides API endpoints for statistical calculations related to reports.
        /// </summary>
        [ApiController]
        [Route("api/statistics")]
        public class StatisticsController(StatisticsService statisticsService) : ControllerBase
        {
            /// <summary>
            /// Calculates the cross rebate for a specified year and quarter.
            /// </summary>
            /// <param name="year">The year for which to calculate the cross rebate.</param>
            /// <param name="quarter">The quarter for which to calculate the cross rebate.</param>
            /// <returns>A decimal value representing the cross rebate.</returns>
            [HttpGet("cross-rebate")]
            public async Task<IActionResult> GetCrossRebate(int year, int quarter)
            {
                var result = await statisticsService.CalculateCrossRebateAsync(year, quarter);
                return Ok(result);
            }

            /// <summary>
            /// Calculates the total points for a specified year and quarter.
            /// </summary>
            /// <param name="year">The year for which to calculate total points.</param>
            /// <param name="quarter">The quarter for which to calculate total points.</param>
            /// <returns>A decimal value representing the total points.</returns>
            [HttpGet("total-points")]
            public async Task<IActionResult> GetTotalPoints(int year, int quarter)
            {
                var result = await statisticsService.CalculatePointsAsync(year, quarter);
                return Ok(result);
            }

            /// <summary>
            /// Calculates the points for a specific category for a specified year and quarter.
            /// </summary>
            /// <param name="categoryId">The ID of the category for which to calculate points.</param>
            /// <param name="year">The year for which to calculate category points.</param>
            /// <param name="quarter">The quarter for which to calculate category points.</param>
            /// <returns>A decimal value representing the category points.</returns>
            [HttpGet("category-points/{categoryId}")]
            public async Task<IActionResult> GetCategoryPoints(int categoryId, int year, int quarter)
            {
                var result = await statisticsService.CalculateCategoryPointsAsync(categoryId, year, quarter);
                return Ok(result);
            }

            /// <summary>
            /// Calculates the completion progress for a specific product for a specified year and quarter.
            /// </summary>
            /// <param name="productId">The ID of the product for which to calculate completion progress.</param>
            /// <param name="year">The year for which to calculate product completion progress.</param>
            /// <param name="quarter">The quarter for which to calculate product completion progress.</param>
            /// <returns>A decimal value representing the product completion progress.</returns>
            [HttpGet("product-completion/{productId}")]
            public async Task<IActionResult> GetProductCompletionProgress(int productId, int year, int quarter)
            {
                var result = await statisticsService.CalculateProductCompletionProgressAsync(productId, year, quarter);
                return Ok(result);
            }

            /// <summary>
            /// Counts the number of completed items in a specific category for a specified year and quarter.
            /// </summary>
            /// <param name="categoryId">The ID of the category for which to count completed items.</param>
            /// <param name="year">The year for which to count completed items.</param>
            /// <param name="quarter">The quarter for which to count completed items.</param>
            /// <returns>An integer representing the count of completed items in the category.</returns>
            [HttpGet("category-completed/{categoryId}")]
            public async Task<IActionResult> CountCategoryCompleted(int categoryId, int year, int quarter)
            {
                var result = await statisticsService.CountCategoryCompletedAsync(categoryId, year, quarter);
                return Ok(result);
            }

            /// <summary>
            /// Calculates the completion progress for a specific category for a specified year and quarter.
            /// </summary>
            /// <param name="categoryId">The ID of the category for which to calculate completion progress.</param>
            /// <param name="year">The year for which to calculate category completion progress.</param>
            /// <param name="quarter">The quarter for which to calculate category completion progress.</param

            [HttpGet("category-completion/{categoryId}")]
            public async Task<IActionResult> GetCategoryCompletionProgress(int categoryId, int year, int quarter)
            {
                var result = await statisticsService.CalculateCategoryCompletionProgressAsync(categoryId, year, quarter);
                return Ok(result);
            }
        }
    }
}
