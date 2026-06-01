<script setup lang="ts">
type EventItem = {
  id: number
  name: string
  detail: string
  source: string
}

defineProps<{
  events: EventItem[]
}>()
</script>

<template>
  <ol v-if="events.length" class="event-log">
    <li v-for="event in events" :key="event.id">
      <span class="event-log__name">{{ event.name }}</span>
      <span class="event-log__detail">{{ event.detail }}</span>
      <span class="event-log__source">{{ event.source }}</span>
    </li>
  </ol>
  <p v-else class="event-log event-log--empty">
    Interact with the editor to see emitted events.
  </p>
</template>
