import { createAsyncAction, ActionType, getType } from 'typesafe-actions';
import { RequestError } from 'core/api/types';
import { OrgsState } from 'store/types';

const DEFAULT_STATE: OrgsState = {
  inventory: null,
};

export const orgsGetInventoryAction = createAsyncAction(
  'GET_INVENTORY_REQUEST',
  'GET_INVENTORY_SUCCESS',
  'GET_INVENTORY_FAILURE',
)<string, Pick<OrgsState, 'inventory'>, RequestError>();

export type OrgsActions = (
  ActionType<typeof orgsGetInventoryAction>
);

export function orgsReducer(state: OrgsState = DEFAULT_STATE, action: OrgsActions): OrgsState {
  switch (action.type) {
    case getType(orgsGetInventoryAction.request):
      return {
        ...state,
      };
    case getType(orgsGetInventoryAction.success):
      return {
        ...state,
        inventory: action.payload.inventory,
      };
    case getType(orgsGetInventoryAction.failure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
