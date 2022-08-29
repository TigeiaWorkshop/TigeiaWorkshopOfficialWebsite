using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace NETCoreBackend.Models;

public class User : AbstractModel
{
    [Display(Name = "name")]
    public string Name { get; set; } = string.Empty;

    [Display(Name = "email")]
    public string Email { get; set; } = string.Empty;

    [Display(Name = "passwordHash")]
    public byte[] PasswordHash { get; set; } = Array.Empty<byte>();

    [Display(Name = "passwordSalt")]
    public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

    [Display(Name = "birthday")]
    public DateTime Birthday { get; set; }

    [Display(Name = "group")]
    public int Group { get; set; } = 0;

    [Display(Name = "posts")]
    public List<Post> Posts { get; set; } = new();

    [Display(Name = "comments")]
    public List<Comment> Comments { get; set; } = new();

    [Display(Name = "registerIp")]
    public string RegisterIp { get; set; } = string.Empty;

    [Display(Name = "loginIp")]
    public string LoginIp { get; set; } = string.Empty;

    [Display(Name = "friends")]
    public List<User> Friends { get; set; } = new();

    [Display(Name = "credits")]
    public int Credits { get; set; } = 0;

    [Display(Name = "money")]
    public int Money { get; set; } = 0;

    [Display(Name = "exp")]
    public int Exp { get; set; } = 0;

    [Display(Name = "signature")]
    public string Signature { get; set; } = string.Empty;

    [Display(Name = "avatar")]
    public string Avatar { get; set; } = string.Empty;

    [Display(Name = "banned")]
    public bool Banned { get; set; } = false;

    [NotMapped]
    [Display(Name = "password")]
    public string Password { get; set; } = string.Empty;
}