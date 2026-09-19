using HelpDesk.Domain.Enums;

namespace HelpDesk.Application.DTOs.Tickets;

public class UpdateTicketRequest
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public TicketPriority Priority { get; set; }

    public int CategoryId { get; set; }
}