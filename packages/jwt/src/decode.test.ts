import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';

import { decodeJwt } from './decode';

describe('decodeJwt', () => {
  it('should decode a valid JWT token', () => {
    const token =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6InNzb19vaWRjX2tleV9wYWlyXzAxSFhIR1lYRFFQUUg1MEFIVEZUR0NRRUFSIn0.eyJpc3MiOiJodHRwczovL2FwaS53b3Jrb3MuY29tIiwic3ViIjoidXNlcl8wMUoxMlQ1Q1ExWjRFOVNSOTFGWkVRUzhZMiIsInNpZCI6InNlc3Npb25fMDFKMTVQMVNON0tTVzBHQVJIRTlOUVZUN0IiLCJqdGkiOiIwMUoxNVAxU1FRVFdHUFRSUDEzRk1HTkYxUyIsImV4cCI6MTcxOTI1MTg2MCwiaWF0IjoxNzE5MjUxNTYwfQ.g4yTnVAmzUEKLCHc9_po0fThFVUcLvPrSWa5WgXlvc8lv5JdEMRsazL0nEDckGoWe6ecnnVfsEmPUfaL_DHB98xgysoJy76kOmzIpAvdE_OIjJ5E8RPswqx0a4cLinUDOMEq4Axpu02Gb_1Qm9V3FZ6YHo6o_5beTGPjTIOs956qLa6SzNwYKqaR1yx8DNUQaXFhLHjhsZ97OAD3fhVCPggALXMVE64znW1l3wCCnXO4eCJ911G_TH4DuBD4vZvm2ko3H33e-C1ULb-MqZwhVY0R1f78hG3QoSP2odcodJou186BngkVRSH5QKTy71904hDTB3iJ4pnuzFk02qkk2Q';
    const program = decodeJwt(token);
    const effect = Effect.runSync(program);

    // Assert the result using your preferred testing library
    // For example, using Jest:
    expect(effect).toEqual({
      iss: 'https://api.workos.com',
      sub: 'user_01J12T5CQ1Z4E9SR91FZEQS8Y2',
      sid: 'session_01J15P1SN7KSW0GARHE9NQVT7B',
      jti: '01J15P1SQQTWGPTRP13FMGNF1S',
      exp: 1719251860,
      iat: 1719251560,
    });
  });

  //   it('should fail to decode an invalid JWT token', () => {
  //     const token = 'your-invalid-jwt-token';
  //     const program = decodeJwt(token);
  //     const effect = Effect.runSyncExit(program);

  //     if (effect._tag === 'Failure') {
  //       expect(effect.cause).toBeInstanceOf(InvalidTokenError);
  //     }
  //   });
});
