using HelpDesk.Application.DTOs.Tickets;

namespace HelpDesk.Infrastructure.Services;

public interface ITicketService
{
    Task<IEnumerable<object>> GetAllAsync();

    Task<object?> GetByIdAsync(int id);

    Task<object> CreateAsync(
        CreateTicketRequest request,
        int userId);

    Task<bool> UpdateAsync(
        int id,
        UpdateTicketRequest request);

    Task<bool> DeleteAsync(int id);

    Task<bool> AssignAsync(
        int ticketId,
        int userId);

    Task<bool> ChangeStatusAsync(
        int ticketId,
        ChangeStatusRequest request,
        int changedById);

    Task<bool> AddCommentAsync(
        int ticketId,
        AddCommentRequest request,
        int userId);
}