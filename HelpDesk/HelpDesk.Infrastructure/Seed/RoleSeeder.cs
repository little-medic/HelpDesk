using HelpDesk.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Infrastructure.Data.Seed;

public static class RoleSeeder
{
    public static async Task SeedAsync(
        HelpDeskDbContext context)
    {
        if (!await context.Roles.AnyAsync())
        {
            var roles = new List<Role>
            {
                new Role { Name = "Admin" },
                new Role { Name = "Manager" },
                new Role { Name = "Employee" }
            };

            await context.Roles.AddRangeAsync(roles);

            await context.SaveChangesAsync();
        }

        var user = await context.Users
            .FirstOrDefaultAsync(
                u => u.Email == "admin@test.com");

        if (user != null)
        {
            var adminRole = await context.Roles
                .FirstAsync(r => r.Name == "Admin");

            if (user.RoleId != adminRole.RoleId)
            {
                user.RoleId = adminRole.RoleId;

                await context.SaveChangesAsync();
            }
        }
    }
}