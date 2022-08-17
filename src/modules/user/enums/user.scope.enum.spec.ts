import {
  UserScopeDescriptionEnum,
  UserScopeEnum,
} from '@shared/enums/user-scope.enum';

describe('TDD', () => {
  it('Enum', () => {
    const e = UserScopeDescriptionEnum[UserScopeEnum[UserScopeEnum.ADMIN]];
    expect(e).toBeDefined();
  });
});
