using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Notes.API.Data;
using Notes.API.Models.Entities;

namespace Notes.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : Controller
    {
        private readonly NotesDbContext notesDbContext;

        public NotesController(NotesDbContext notesDbContext)
        {
            this.notesDbContext = notesDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GettAllNotes() {

            return Ok(await notesDbContext.Notes.ToListAsync());

        }

        [HttpGet]
        [Route("{id:Guid}")]
        [ActionName("GetNoteById")]
        public async Task<IActionResult> GetNoteById([FromRoute] Guid id)
        {

            var result = await notesDbContext.Notes.FindAsync(id);

            if (result == null)
            {
                return NotFound();
            }
            else { return Ok(result); }
        }

        [HttpPost]

        public async Task<IActionResult> AddNote(Note note)
        {
            note.Id = Guid.NewGuid();
            await notesDbContext.Notes.AddAsync(note);
            await notesDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNoteById), new { id = note.Id }, note);
        }

        [HttpPut]
        [Route("{id:Guid}")]

        public async Task<IActionResult> UpdateNote([FromRoute] Guid id, [FromBody] Note UpdatedNote)
        {
            var result = await notesDbContext.Notes.FindAsync(id);

            if (result == null)
            {
                return NotFound();
            }
            else
            {
                result.Title = UpdatedNote.Title;
                result.Description = UpdatedNote.Description;
                result.IsVisibile = UpdatedNote.IsVisibile;
                await notesDbContext.SaveChangesAsync();
                return Ok(result);
            }
        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteNote([FromRoute] Guid id)
        {
            var existingNote = await notesDbContext.Notes.FindAsync(id);

            if (existingNote == null)
            {
                return NotFound();
            }
            notesDbContext.Remove(existingNote);
            await notesDbContext.SaveChangesAsync();
            return Ok();

        }

    }

}