using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;
using NETCoreBackend.Services;

namespace NETCoreBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private const int MIN_NAME_LENGTH = 2;
    private const int MAX_NAME_LENGTH = 16;

    private const int MIN_PASSWORD_LENGTH = 8;
    private const int MAX_PASSWORD_LENGTH = 16;

    private readonly UsersService _usersService;

    public UsersController(UsersService usersService)
    {
        this._usersService = usersService;
    }

    private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using HMACSHA512 hmac = new();
        passwordSalt = hmac.Key;
        passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    }

    private static bool VerifyPasswordHash(string password, IEnumerable<byte> passwordHash, byte[] passwordSalt)
    {
        using HMACSHA512 hmac = new(passwordSalt);
        byte[] computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return computeHash.SequenceEqual(passwordHash);
    }

    [HttpGet("current")]
    public async Task<ActionResult<User>> GetCurrent()
    {
        string theSId = Authentications.ReadJwtToken(this.Request).Claims
            .First(claim => claim.Type == ClaimTypes.PrimarySid).Value;

        if (!int.TryParse(theSId, out int theId))
        {
            return this.NotFound();
        }

        User? user = await this._usersService.GetAsync(theId);

        if (user is not null)
        {
            return user;
        }

        return this.NotFound();
    }

    [HttpGet("get/{id:int}")]
    public async Task<ActionResult<User>> Get(int id)
    {
        User? user = await this._usersService.GetAsync(id);

        if (user is null)
        {
            return this.NotFound();
        }

        return user;
    }

    [HttpPost("new")]
    public async Task<IActionResult> Post(User newUser)
    {
        // ensure the email is not empty and valid
        if (newUser.Email.Length <= 0 || !new EmailAddressAttribute().IsValid(newUser.Email))
        {
            return this.Conflict("Email");
        }

        // ensure the user name length is within range
        if (newUser.Name.Length is < MIN_NAME_LENGTH or > MAX_NAME_LENGTH)
        {
            return this.Conflict("Name");
        }

        // ensure the password length is within range
        if (newUser.Password.Length is < MIN_PASSWORD_LENGTH or > MAX_PASSWORD_LENGTH)
        {
            return this.Conflict("Password");
        }

        // ensure the Date is not in the future
        if (DateTime.Compare(newUser.Birthday, DateTime.Today) > 0)
        {
            return this.Conflict("Birthday");
        }

        newUser.Birthday = DateTime.SpecifyKind(newUser.Birthday, DateTimeKind.Utc);

        // hashing the password
        CreatePasswordHash(newUser.Password, out byte[] passwordHash, out byte[] passwordSalt);
        newUser.PasswordHash = passwordHash;
        newUser.PasswordSalt = passwordSalt;

        // set Login Ip as Register Ip
        newUser.LoginIp = newUser.RegisterIp;

        // create the user
        await this._usersService.CreateAsync(newUser);

        return this.Accepted(new { token = Authentications.CreateJwtToken(newUser) });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(User userThatLogin)
    {
        User? theUserData = await this._usersService.GetByEmailAsync(userThatLogin.Email);

        // ensure that the user exists
        if (theUserData == null)
        {
            return this.Ok(new { accepted = false, email = "email_cannot_find" });
        }

        // whether the password is correct
        if (!VerifyPasswordHash(userThatLogin.Password, theUserData.PasswordHash, theUserData.PasswordSalt))
        {
            return this.Ok(new { accepted = false, password = "password_incorrect" });
        }

        theUserData.UpdatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);

        await this._usersService.SaveChangesAsync();

        return this.Accepted(new { accepted = true, token = Authentications.CreateJwtToken(theUserData) });
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool result = await this._usersService.RemoveAsync(id);

        if (result)
        {
            return this.NoContent();
        }

        return this.NotFound();
    }
}