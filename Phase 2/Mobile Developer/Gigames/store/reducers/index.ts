import {combineReducers} from 'redux';
import todoReducer from './todoReducer';
export const rootReducer = combineReducers({
  todoReducer,
  // Any other reducers you might have
});
export type RootState = ReturnType<typeof rootReducer>;
