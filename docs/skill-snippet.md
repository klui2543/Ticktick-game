## Context tags — energy / place / duration (shared with Klui's dashboard)

Klui's task dashboard (repo `klui2543/Ticktick-game`, static PWA) reads three extra
dimensions off **TickTick tags**. There is no separate store — the tags ARE the contract,
so anything you tag here shows up in his dashboard after a sync, and anything you tag in a
wrong format is invisible to it. Full spec lives in `AGENTS.md` in that repo.

| Format | Meaning | Values in use |
|---|---|---|
| `⚡<level>` | energy the task costs | `⚡สูง` `⚡กลาง` `⚡ต่ำ` |
| `📍<place>` | where it can be done | `📍หน้าคอม` `📍บ้าน` `📍ศิริราช` `📍ที่ไหนก็ได้` |
| `⏱<minutes>` | expected duration | `⏱15` `⏱30` `⏱60` `⏱90` `⏱120` |

- **When you create or triage a task for Klui, tag all three.** A task missing `⏱` is
  excluded from his time-budget totals and lands in a "ยังไม่ได้จัดกลุ่ม" bucket.
- `⚡` only accepts สูง/กลาง/ปานกลาง/ต่ำ/high/mid/medium/low — anything else is dropped silently.
- `📍` accepts any text; **reuse an existing place name verbatim** or it becomes a new group.
- Existing `🎯 ต้องต่อเนื่อง` = high energy and `🔄 แทรกได้` = low energy are read automatically.
  An explicit `⚡` tag always wins over them, so there's no need to remove the old tag.
- Emoji variation selectors are stripped before matching — `⏱️30` and `⏱30` are the same tag.

**Writing tags: `batch_update_tasks` REPLACES the whole `tags` array.** Always read the
task's current tags and include them, or you will silently wipe his project tags
(`ตารางเวรเภสัช`, `การเงิน`, `sync`, `gcal`). Sending only `id` + `projectId` + `tags` does
not clear other fields, but verify one task with `get_task_by_id` before firing a batch.
Inbox's real `projectId` for writes is `inbox125681541`, not `inbox`.

**Energy tags vs the Energy Map badges above are different layers** — the ร้อน/อุ่น/เย็น
rating is per *project* (from the Free Time Framework, stored in Notion), while `⚡` is per
*task*. Don't collapse one into the other.

**Time budget:** the dashboard subtracts shift/appointment hours from the day before
comparing against the `⏱` total, so it can say "งานที่วางไว้เกินเวลาว่าง". It splits
overnight shifts across Bangkok days and refuses to guess duration for events whose start
equals their end. Its free-time figure assumes a flat 16-hour waking day and, like the
calendar, does **not** know about the baseline Mon–Fri 08:30–16:30 dispensary work — so
treat a weekday that looks free in the budget as not actually free.

