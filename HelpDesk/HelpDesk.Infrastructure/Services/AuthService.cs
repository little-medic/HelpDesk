using HelpDesk.Application.DTOs.Auth;
using HelpDesk.Application.Interfaces;
using HelpDesk.Domain.Entities;
using HelpDesk.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly HelpDeskDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public AuthService(
        HelpDeskDbContext context,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<string> RegisterAsync(
        RegisterRequest request)
    {
        var email = request.Email
            .Trim()
            .ToLower();

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (existingUser != null)
        {
            throw new InvalidOperationException(
                "Email is already registered.");
        }

        var employeeRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == "Employee");

        if (employeeRole == null)
        {
            throw new InvalidOperationException(
                "Employee role not found.");
        }

        var user = new User
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = email,
            PasswordHash = _passwordHasher.Hash(
                request.Password),
            RoleId = employeeRole.RoleId
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return _jwtService.GenerateToken(
            user.UserId,
            user.Email,
            employeeRole.Name);
    }

    public async Task<string?> LoginAsync(
        LoginRequest request)
    {
        var email = request.Email
            .Trim()
            .ToLower();

        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            return null;
        }

        var passwordValid =
            _passwordHasher.Verify(
                request.Password,
                user.PasswordHash);

        if (!passwordValid)
        {
            return null;
        }

        return _jwtService.GenerateToken(
            user.UserId,
            user.Email,
            user.Role.Name);
    }
}