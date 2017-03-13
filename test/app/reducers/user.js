import { expect } from 'chai';
import * as types from '../../../app/constants/ActionTypes';
import user from '../../../app/reducers/user';

const loadingUserState = {
  loaded: false,
  loading: true,
  signed_in: false
};

describe('user reducer', () => {
  it('should handle initial state', () => {
    expect(
      user(undefined, {})
    ).to.eql({
      loaded: false,
      loading: false,
      signed_in: false
    });
  });

  describe('loading_user', () => {
    it('should start loading from an unloaded state', () => {
      expect(
        user({
          loaded: false,
          loading: false,
          signed_in: false
        }, { type: types.LOADING_USER })
      ).to.eql({
        loaded: false,
        loading: true,
        signed_in: false
      });
    });

    it('should start loading from a loaded state', () => {
      expect(
        user({
          loaded: true,
          loading: false,
          signed_in: false
        }, { type: types.LOADING_USER })
      ).to.eql({
        loaded: true,
        loading: true,
        signed_in: false
      });
    });
  });

  describe('user loaded', () => {
    it('should handle a user not being signed in', () => {
      expect(
        user(loadingUserState, { type: types.USER_LOADED, payload: {} })
      ).to.eql({
        loaded: true,
        loading: false,
        signed_in: false
      });
    });

    it('should handle a user being signed in', () => {
      expect(
        user(loadingUserState, { type: types.USER_LOADED, payload: { login: 'ausername' } })
      ).to.eql({
        loaded: true,
        loading: false,
        signed_in: true
      });
    });
  });

  describe('user load error', () => {
    it('reset the user info', () => {
      expect(
        user(loadingUserState, { type: types.USER_LOAD_ERROR })
      ).to.eql({
        loaded: false,
        loading: false,
        signed_in: false
      });
    });
  });
});
