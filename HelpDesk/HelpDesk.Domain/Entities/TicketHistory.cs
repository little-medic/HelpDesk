using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HelpDesk.Domain.Enums;

namespace HelpDesk.Domain.Entities;

public class TicketHistory
{
    public int TicketHistoryId { get; set; }

    public TicketStatus? OldStatus { get; set; }
    public TicketStatus NewStatus { get; set; }

    public DateTime ChangedAt { get; set; }

    public int TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    public int ChangedById { get; set; }
    public User ChangedBy { get; set; } = null!;
}