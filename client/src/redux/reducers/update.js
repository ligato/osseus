import { createReducer } from 'redux-starter-kit'

const initialState = {
  first: {
    second: {
      id1: { fourth: 'a' },
      id2: { fourth: 'b' }
    }
  }
}

const reducer = createReducer(initialState, {
  UPDATE_ITEM: (state, action) => {
    state.first.second[action.someId].fourth = action.someValue
  }
})
