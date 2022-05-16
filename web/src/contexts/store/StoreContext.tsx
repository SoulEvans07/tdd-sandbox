import { createContext, PropsWithChildren, ReactElement, useContext, useMemo, useReducer } from 'react';
import { ActionType } from 'typesafe-actions';
import { rootReducer } from './reducers';
import { StoreSelector, StoreData, initialStoreData } from './types';
import * as actions from './actions';

export interface StoreContext {
  data: StoreData;
  dispatch: React.Dispatch<ActionType<typeof actions>>;
}

const Store = createContext<StoreContext | undefined>(undefined);

export const StoreConsumer = Store.Consumer;

export function useStore() {
  const context = useContext(Store);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
}

export function useSelector<T>(selector: StoreSelector<T>): T {
  const { data } = useStore();
  const selected = useMemo(() => selector(data), [selector, data]);
  return selected;
}

export function useDispatch(): StoreContext['dispatch'] {
  const { dispatch } = useStore();
  return dispatch;
}

interface StoreProps {
  initial?: StoreData;
}

export function StoreProvider(props: PropsWithChildren<StoreProps>): ReactElement {
  const { initial, ...restProps } = props;

  const [data, dispatch] = useReducer(rootReducer, initial || initialStoreData);

  return <Store.Provider value={{ data, dispatch }} {...restProps} />;
}
