using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DashboardBackend.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedReports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quarter",
                table: "Sales");

            migrationBuilder.RenameColumn(
                name: "Year",
                table: "Sales",
                newName: "ReportId");

            migrationBuilder.RenameColumn(
                name: "SaleId",
                table: "Sales",
                newName: "Id");

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Year = table.Column<int>(type: "INTEGER", nullable: false),
                    Quarter = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sales_ReportId",
                table: "Sales",
                column: "ReportId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_Reports_ReportId",
                table: "Sales",
                column: "ReportId",
                principalTable: "Reports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sales_Reports_ReportId",
                table: "Sales");

            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Sales_ReportId",
                table: "Sales");

            migrationBuilder.RenameColumn(
                name: "ReportId",
                table: "Sales",
                newName: "Year");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Sales",
                newName: "SaleId");

            migrationBuilder.AddColumn<int>(
                name: "Quarter",
                table: "Sales",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
