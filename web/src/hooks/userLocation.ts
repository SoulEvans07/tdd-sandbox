import { useLocation as useStatelessLocation, Location } from 'react-router-dom';

export interface LocationState {
  from?: Location;
}

export function useLocation<T extends Partial<Record<string, any>> = LocationState>() {
  return useStatelessLocation() as Location & { state: T };
}
