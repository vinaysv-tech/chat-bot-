import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 401 });
  }

  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Chatbot-App'
  };

  try {
    switch (action) {
      case 'user':
        const userResponse = await fetch('https://api.github.com/user', { headers });
        const userData = await userResponse.json();
        return NextResponse.json(userData);

      case 'repos':
        const reposResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=10', { headers });
        const reposData = await reposResponse.json();
        return NextResponse.json(reposData);

      case 'issues':
        const issuesResponse = await fetch('https://api.github.com/issues?filter=all&state=open&per_page=10', { headers });
        const issuesData = await issuesResponse.json();
        return NextResponse.json(issuesData);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'GitHub API error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 401 });
  }

  const body = await request.json();
  const { action, data } = body;

  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Chatbot-App',
    'Content-Type': 'application/json'
  };

  try {
    switch (action) {
      case 'create-issue':
        const issueResponse = await fetch(`https://api.github.com/repos/${data.owner}/${data.repo}/issues`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: data.title,
            body: data.body,
            labels: data.labels || []
          })
        });
        const issueData = await issueResponse.json();
        return NextResponse.json(issueData);

      case 'create-repo':
        const repoResponse = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            private: data.private || false
          })
        });
        const repoData = await repoResponse.json();
        return NextResponse.json(repoData);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'GitHub API error' }, { status: 500 });
  }
}