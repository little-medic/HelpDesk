using HelpDesk.Application.DTOs.Auth;

namespace HelpDesk.Application.Interfaces;

public interface IAuthService
{
    Task<string> RegisterAsync(RegisterRequest request);

    Task<string?> LoginAsync(LoginRequest request);
}