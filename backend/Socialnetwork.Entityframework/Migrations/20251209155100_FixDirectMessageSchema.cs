using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Socialnetwork.Entityframework.Migrations
{
    /// <inheritdoc />
    public partial class FixDirectMessageSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PostId",
                table: "DirectMessages",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DirectMessages_PostId",
                table: "DirectMessages",
                column: "PostId");

            migrationBuilder.AddForeignKey(
                name: "FK_DirectMessages_Posts_PostId",
                table: "DirectMessages",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DirectMessages_Posts_PostId",
                table: "DirectMessages");

            migrationBuilder.DropIndex(
                name: "IX_DirectMessages_PostId",
                table: "DirectMessages");

            migrationBuilder.DropColumn(
                name: "PostId",
                table: "DirectMessages");
        }
    }
}
