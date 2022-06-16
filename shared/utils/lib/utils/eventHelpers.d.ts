import { SyntheticEvent, EventHandler } from 'react';
export declare function stopPropagation<E extends SyntheticEvent<unknown>>(eventHandler: EventHandler<E>): EventHandler<E>;
