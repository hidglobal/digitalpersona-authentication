import { Env } from '../../test'
import { U2FAuth } from '.';
import { User } from '@digitalpersona/core';
import { AuthService } from '@digitalpersona/services';

describe("U2F Token: ", ()=>
{
    let api: U2FAuth;

    const user: User = new User("alpha\\administrator");

    beforeEach(()=>{
        api = new U2FAuth(
            new AuthService(Env.AuthServerEndpoint)
        );
    })

    it("must authenticate", async ()=>{
        if (!Env.Integration) return;
        expectAsync(api.authenticate(user))
            .toBeRejected(); //.toBeResolved();
    });

    it("must get AppID", async ()=>{
        if (!Env.Integration) return;
        const appid = await api.getAppId();
        expect(appid).toBe(Env.AppId);
    })

})
