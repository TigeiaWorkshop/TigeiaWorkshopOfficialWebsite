using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public abstract class AbstractModel
{
    [Key]
    public int Id { get; set; }

    [Required]
    [Display(Name = "createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);

    [Required]
    [Display(Name = "updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
}