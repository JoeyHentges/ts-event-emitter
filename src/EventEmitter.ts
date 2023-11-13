type Listener<T extends Array<any>> = (...args: T) => void

export class EventEmitter<EventMap extends Record<string, Array<any>>> {
  private eventListeners: {
    [K in keyof EventMap]?: Set<Listener<EventMap[K]>>
  } = {}

  /**
   * Add an event listener
   * @param eventName The name of the event
   * @param listener The listener triggered when the event is emitted
   */
  on<K extends keyof EventMap>(eventName: K, listener: Listener<EventMap[K]>) {
    const listeners = this.eventListeners[eventName] ?? new Set()
    listeners.add(listener)
    this.eventListeners[eventName] = listeners
  }

  /**
   * Add a single use event listener.
   * Once the listener is used, it will be automatically removed.
   * @param eventName The name of the event
   * @param listener The listener triggered when the event is emitted
   */
  once<K extends keyof EventMap>(
    eventName: K,
    listener: Listener<EventMap[K]>
  ) {
    const listeners = this.eventListeners[eventName] ?? new Set()
    listeners.add((...args: EventMap[K]) => {
      listener(...args)
      this.removeListener(eventName)
    })
    this.eventListeners[eventName] = listeners
  }

  /**
   * Remove an event listener
   * @param eventName The name of the event
   */
  removeListener<K extends keyof EventMap>(eventName: K) {
    delete this.eventListeners[eventName]
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners() {
    this.eventListeners = {}
  }

  /**
   * Emit an event on a listener
   * @param eventName The name of the event
   * @param args All arguments applicable for the event
   */
  emit<K extends keyof EventMap>(eventName: K, ...args: EventMap[K]) {
    const listeners = this.eventListeners[eventName] ?? new Set()
    for (const listener of listeners) {
      listener(...args)
    }
  }
}
