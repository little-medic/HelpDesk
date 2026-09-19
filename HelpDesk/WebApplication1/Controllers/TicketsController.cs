using HelpDesk.Application.DTOs.Tickets;
using HelpDesk.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HelpDesk.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketsController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    private int CurrentUserId =>
        int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(
            await _ticketService.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ticket =
            await _ticketService.GetByIdAsync(id);

        if (ticket == null)
        {
            return NotFound();
        }

        return Ok(ticket);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateTicketRequest request)
    {
        try
        {
            var ticket =
                await _ticketService.CreateAsync(
                    request,
                    CurrentUserId);

            return Ok(ticket);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateTicketRequest request)
    {
        try
        {
            var result =
                await _ticketService.UpdateAsync(
                    id,
                    request);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result =
            await _ticketService.DeleteAsync(id);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPut("{id:int}/assign")]
    public async Task<IActionResult> Assign(
        int id,
        AssignTicketRequest request)
    {
        try
        {
            var result =
                await _ticketService.AssignAsync(
                    id,
                    request.UserId);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> ChangeStatus(
        int id,
        ChangeStatusRequest request)
    {
        var result =
            await _ticketService.ChangeStatusAsync(
                id,
                request,
                CurrentUserId);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("{id:int}/comments")]
    public async Task<IActionResult> AddComment(
        int id,
        AddCommentRequest request)
    {
        var result =
            await _ticketService.AddCommentAsync(
                id,
                request,
                CurrentUserId);

        if (!result)
        {
            return NotFound();
        }

        return Ok(new
        {
            message = "Comment added successfully."
        });
    }
}