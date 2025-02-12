import { Preset } from '../Preset.ts'

export type GitHubUser = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string | null
  email: string
  hireable: boolean
  bio: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  private_gists: number
  total_private_repos: number
  owned_private_repos: number
  disk_usage: number
  collaborators: number
  two_factor_authentication: boolean
  plan: {
    name: string
    space: number
    collaborators: number
    private_repos: number
  }
  emails: {
    email: string
    primary: boolean
    verified: boolean
    visibility: string | null
  }[]
}

/**
 * Check out [GitHub's Developer Portal](https://github.com/settings/developers) to learn more.
 *
 * Default scopes:
 * - `read:user`
 * - `user:email`
 */
export const GitHub = new Preset<
  GitHubUser,
  {
    allow_signup?: boolean
  }
>(
  'v1',
  {
    oauth2: {
      authorize_url: 'github.com/login/oauth/authorize',
      user_url: 'api.github.com/user',
      token_url: 'github.com/login/oauth/access_token',
      scope: [
        'read:user',
        'user:email',
      ],
    },
    advanced: {
      async get_detailed_user(t, d) {
        const emailResponse = await fetch(
          'https://api.github.com/user/emails',
          {
            headers: {
              accept: 'application/json',
              authorization: `Bearer ${t}`,
            },
          },
        )

        const emails = await emailResponse.json()

        d.emails = emails
        d.email =
          (emails.find((e: { primary: boolean }) => e.primary) ?? emails[0])
            .email

        return d
      },
    },
  },
)
