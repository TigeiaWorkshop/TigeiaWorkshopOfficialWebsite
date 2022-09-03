﻿using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;
using NETCoreBackend.Services;

namespace NETCoreBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly PostsService _postsService;

    public PostsController(DatabaseContext db)
    {
        this._postsService = new PostsService(db);
    }

    [HttpGet("count/{field:int}")]
    public async Task<ActionResult<long>> Count(int field)
    {
        return await this._postsService.CountAsync(field);
    }

    [HttpGet("get/latest/{field:int}")]
    public async Task<ActionResult<Post>> GetLatest(int field)
    {
        Post? post = await this._postsService.GetLatestAsync(field);

        if (post is null)
        {
            return this.NotFound();
        }

        return post;
    }

    [HttpGet("get/all/{field:int}")]
    public async Task<List<Post>> GetAll(int field)
    {
        return await this._postsService.GetAllAsync(field);
    }

    [HttpGet("get/{id:int}")]
    public async Task<ActionResult<Post>> Get(int id)
    {
        Post? post = await this._postsService.GetAsync(id);

        if (post is null)
        {
            return this.NotFound();
        }

        return post;
    }

    [HttpPost("new")]
    public async Task<IActionResult> Post(Post newPost)
    {
        // create the post
        if (await this._postsService.CreateAsync(newPost))
        {
            return this.Accepted(new { id = newPost.Id });
        }

        return this.Conflict();
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool result = await this._postsService.RemoveAsync(id);

        if (result)
        {
            return this.NoContent();
        }

        return this.NotFound();
    }
}