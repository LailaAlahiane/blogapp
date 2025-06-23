<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::with('user')
            ->latest()
            ->paginate(10);
        return response()->json($articles);
    }

    public function show($id)
    {
        $article = Article::with('user')->findOrFail($id);
        return response()->json($article);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $article = $request->user()->articles()->create([
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($article, 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        if ($article->user_id !== $request->user()->id) {
            throw ValidationException::withMessages([
                'user' => ['Vous n\'êtes pas autorisé à modifier cet article.'],
            ]);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $article->update([
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($article);
    }

    public function destroy(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        if ($article->user_id !== $request->user()->id) {
            throw ValidationException::withMessages([
                'user' => ['Vous n\'êtes pas autorisé à supprimer cet article.'],
            ]);
        }

        $article->delete();

        return response()->json(['message' => 'Article supprimé avec succès']);
    }
} 