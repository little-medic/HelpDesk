using HelpDesk.Application.DTOs.Categories;
using HelpDesk.Domain.Entities;
using HelpDesk.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoryController : ControllerBase
{
    private readonly HelpDeskDbContext _context;

    public CategoryController(HelpDeskDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.Name)
            .Select(c => new
            {
                c.CategoryId,
                c.Name,
                c.Description
            })
            .ToListAsync();

        return Ok(categories);
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateCategoryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new
            {
                message = "Category name is required."
            });
        }

        var name = request.Name.Trim();

        var exists = await _context.Categories
            .AnyAsync(c => c.Name == name);

        if (exists)
        {
            return BadRequest(new
            {
                message = "Category already exists."
            });
        }

        var category = new Category
        {
            Name = name,
            Description = request.Description.Trim()
        };

        _context.Categories.Add(category);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            category.CategoryId,
            category.Name,
            category.Description
        });
    }
}