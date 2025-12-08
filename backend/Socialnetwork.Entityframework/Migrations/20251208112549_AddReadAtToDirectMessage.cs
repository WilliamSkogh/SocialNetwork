using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Socialnetwork.Entityframework.Migrations
{
    /// <inheritdoc />
    public partial class AddReadAtToDirectMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ReadAt",
                table: "DirectMessages",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReadAt",
                table: "DirectMessages");
        }
    }
}
