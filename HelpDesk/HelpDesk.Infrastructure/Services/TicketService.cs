using HelpDesk.Application.DTOs.Tickets;
using HelpDesk.Domain.Entities;
using HelpDesk.Domain.Enums;
using HelpDesk.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Infrastructure.Services;

public class TicketService : ITicketService
{
    private readonly HelpDeskDbContext _context;

    public TicketService(HelpDeskDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<object>> GetAllAsync()
    {
        return await _context.Tickets
            .Include(t => t.Category)
            .Include(t => t.CreatedBy)
            .Include(t => t.AssignedTo)
            .Select(t => new
            {
                t.TicketId,
                t.Title,
                t.Description,
                t.Status,
                t.Priority,
                t.CreatedAt,
                t.UpdatedAt,

                Category = t.Category.Name,

                CreatedBy = t.CreatedBy.Email,

                AssignedTo = t.AssignedTo != null
                    ? t.AssignedTo.Email
                    : null
            })
            .ToListAsync();
    }

    public async Task<object?> GetByIdAsync(int id)
    {
        return await _context.Tickets
            .Include(t => t.Category)
            .Include(t => t.CreatedBy)
            .Include(t => t.AssignedTo)
            .Include(t => t.Comments)
                .ThenInclude(c => c.User)
            .Include(t => t.History)
                .ThenInclude(h => h.ChangedBy)
            .Where(t => t.TicketId == id)
            .Select(t => new
            {
                t.TicketId,
                t.Title,
                t.Description,
                t.Status,
                t.Priority,
                t.CreatedAt,
                t.UpdatedAt,

                Category = new
                {
                    t.Category.CategoryId,
                    t.Category.Name
                },

                CreatedBy = new
                {
                    t.CreatedBy.UserId,
                    t.CreatedBy.FirstName,
                    t.CreatedBy.LastName,
                    t.CreatedBy.Email
                },

                AssignedTo = t.AssignedTo == null
                    ? null
                    : new
                    {
                        t.AssignedTo.UserId,
                        t.AssignedTo.FirstName,
                        t.AssignedTo.LastName,
                        t.AssignedTo.Email
                    },

                Comments = t.Comments
                    .OrderBy(c => c.CreatedAt)
                    .Select(c => new
                    {
                        c.CommentId,
                        c.Content,
                        c.CreatedAt,
                        User = c.User.Email
                    }),

                History = t.History
                    .OrderBy(h => h.ChangedAt)
                    .Select(h => new
                    {
                        h.TicketHistoryId,
                        h.OldStatus,
                        h.NewStatus,
                        h.ChangedAt,
                        ChangedBy = h.ChangedBy.Email
                    })
            })
            .FirstOrDefaultAsync();
    }

    public async Task<object> CreateAsync(
        CreateTicketRequest request,
        int userId)
    {
        var categoryExists = await _context.Categories
            .AnyAsync(c => c.CategoryId == request.CategoryId);

        if (!categoryExists)
        {
            throw new InvalidOperationException(
                "Category not found.");
        }

        var ticket = new Ticket
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Priority = request.Priority,
            Status = TicketStatus.Open,
            CreatedAt = DateTime.UtcNow,
            CreatedById = userId,
            CategoryId = request.CategoryId
        };

        _context.Tickets.Add(ticket);

        await _context.SaveChangesAsync();

        return new
        {
            ticket.TicketId,
            ticket.Title,
            ticket.Description,
            ticket.Status,
            ticket.Priority,
            ticket.CreatedAt,
            ticket.CategoryId,
            ticket.CreatedById
        };
    }

    public async Task<bool> UpdateAsync(
        int id,
        UpdateTicketRequest request)
    {
        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(t => t.TicketId == id);

        if (ticket == null)
        {
            return false;
        }

        var categoryExists = await _context.Categories
            .AnyAsync(c => c.CategoryId == request.CategoryId);

        if (!categoryExists)
        {
            throw new InvalidOperationException(
                "Category not found.");
        }

        ticket.Title = request.Title.Trim();
        ticket.Description = request.Description.Trim();
        ticket.Priority = request.Priority;
        ticket.CategoryId = request.CategoryId;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(t => t.TicketId == id);

        if (ticket == null)
        {
            return false;
        }

        _context.Tickets.Remove(ticket);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> AssignAsync(
        int ticketId,
        int userId)
    {
        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(t => t.TicketId == ticketId);

        if (ticket == null)
        {
            return false;
        }

        var userExists = await _context.Users
            .AnyAsync(u => u.UserId == userId);

        if (!userExists)
        {
            throw new InvalidOperationException(
                "User not found.");
        }

        ticket.AssignedToId = userId;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ChangeStatusAsync(
        int ticketId,
        ChangeStatusRequest request,
        int changedById)
    {
        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(t => t.TicketId == ticketId);

        if (ticket == null)
        {
            return false;
        }

        var oldStatus = ticket.Status;

        if (oldStatus == request.Status)
        {
            return true;
        }

        ticket.Status = request.Status;
        ticket.UpdatedAt = DateTime.UtcNow;

        var history = new TicketHistory
        {
            TicketId = ticketId,
            OldStatus = oldStatus,
            NewStatus = request.Status,
            ChangedAt = DateTime.UtcNow,
            ChangedById = changedById
        };

        _context.TicketHistories.Add(history);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> AddCommentAsync(
        int ticketId,
        AddCommentRequest request,
        int userId)
    {
        var ticketExists = await _context.Tickets
            .AnyAsync(t => t.TicketId == ticketId);

        if (!ticketExists)
        {
            return false;
        }

        var comment = new Comment
        {
            TicketId = ticketId,
            UserId = userId,
            Content = request.Content.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);

        await _context.SaveChangesAsync();

        return true;
    }
}