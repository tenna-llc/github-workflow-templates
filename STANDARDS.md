# Tenna Cross-Repo Engineering Standards

> Seed doc — v0. This is the starting point for conventions we want enforced
> consistently across Tenna repos via `claude-code-review.yml`. Add to it as
> real PRs surface a pattern worth generalizing; don't backfill speculatively.

## Retries and side effects

- A retry MUST NOT be able to re-run a side effect (queue publish, DB write,
  webhook/notification call) that a previous attempt already completed.
  If a loop streams results out to a caller as it goes, retrying that loop
  from the top replays everything already emitted — retry at the level of
  the individual unit of work instead (e.g. per page/request), not around
  the whole stream.
- Use `timers/promises`' `setTimeout` for retry backoff delays in Node
  services, not a hand-rolled `new Promise(resolve => setTimeout(...))`.

## Consistency over local optimization

- Prefer matching an existing pattern already used elsewhere in the same
  repo over introducing a new, arguably-better one, unless the PR's purpose
  is specifically to change that pattern everywhere.
