import { SmartCardAuth } from './auth';
import { Env } from '../../test';
import { User } from '@digitalpersona/core';
import { AuthService } from '@digitalpersona/services';

describe("CardsApi: ", ()=>
{
    let api: SmartCardAuth;

    const user: User = new User("alpha\\administrator");

    beforeEach(()=>{
        api = new SmartCardAuth(
            new AuthService(Env.AuthServerEndpoint),
        );
    })

})
