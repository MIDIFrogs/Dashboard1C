using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DashboardBackend.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedIndexing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Reports_Year_Quarter",
                table: "Reports",
                columns: new[] { "Year", "Quarter" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_Name",
                table: "Products",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Name",
                table: "Categories",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reports_Year_Quarter",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Products_Name",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Categories_Name",
                table: "Categories");
        }
    }
}
