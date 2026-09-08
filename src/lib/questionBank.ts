import { QUESTIONS } from '../data/questions'
import type { CategoryId, Question } from '../types'

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export class QuestionBank {
  private queues = new Map<CategoryId, Question[]>()

  next(category: CategoryId): Question {
    let queue = this.queues.get(category)
    if (!queue || queue.length === 0) {
      const pool = QUESTIONS.filter((q) => q.category === category)
      queue = shuffle(pool)
      this.queues.set(category, queue)
    }
    return queue.pop()!
  }
}
