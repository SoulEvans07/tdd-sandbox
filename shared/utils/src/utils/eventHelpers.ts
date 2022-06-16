import { SyntheticEvent, EventHandler } from 'react';

export function stopPropagation<E extends SyntheticEvent<unknown>>(eventHandler: EventHandler<E>): EventHandler<E> {
  return (event: E) => {
    event.stopPropagation();
    eventHandler(event);
  };
}
