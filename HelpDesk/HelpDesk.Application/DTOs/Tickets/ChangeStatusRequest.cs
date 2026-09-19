using HelpDesk.Domain.Enums;

namespace HelpDesk.Application.DTOs.Tickets;

public class ChangeStatusRequest
{
    public TicketStatus Status { get; set; }
}