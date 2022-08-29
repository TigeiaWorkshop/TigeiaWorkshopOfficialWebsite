using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using NETCoreBackend.Models;

namespace NETCoreBackend.Modules;

public sealed class Authentications
{
    private const string TOKEN =
        "EEQMcmb1D/3C0medg2v+uuEJ6a7bz+q0L0/da1AUSzcqVY8OgqxzMLn8kLwK4unFFjAmfzMxBLe2eDWe4GGcYg==";

    public static string CreateJwtToken(User theUser)
    {
        List<Claim> claims = new()
        {
            new Claim(ClaimTypes.Name, theUser.Name),
            new Claim(ClaimTypes.PrimarySid, theUser.Id.ToString()),
            new Claim(ClaimTypes.Email, theUser.Email)
        };

        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(TOKEN));

        SigningCredentials cred = new(key, SecurityAlgorithms.HmacSha512Signature);

        JwtSecurityToken token = new(claims: claims, expires: DateTime.Now.AddDays(1), signingCredentials: cred);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static JwtSecurityToken ReadJwtToken(HttpRequest theRequest)
    {
        string theTokenString = theRequest.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
        return new JwtSecurityTokenHandler().ReadJwtToken(theTokenString);
    }
}