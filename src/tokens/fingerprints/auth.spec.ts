import { Env } from '../../test';
import { FingerprintsAuth } from './auth';
import { User } from '@digitalpersona/core';
import { AuthService } from '@digitalpersona/services';

describe("FingerprintsApi: ", () =>
{
    let api: FingerprintsAuth;

    beforeEach(()=>{
        api = new FingerprintsAuth(
            new AuthService(Env.AuthServerEndpoint),
        );
    })

    it("must get enrolled fingers", async() => {
        if (!Env.Integration) return;
        const fingers = await api.getEnrolledFingers(new User("alpha\\administrator"));
        expect(fingers.length).toBeGreaterThan(0);
    })
})
