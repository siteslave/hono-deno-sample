import { assert, assertEquals } from "https://deno.land/std@0.205.0/assert/mod.ts";

const startServer = () => {
    const server = new Deno.Command(Deno.execPath(), {
        args: ["run", "-A", "server.ts"],
        stdout: "piped",
        stderr: "piped",
    });
    return server.spawn();
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

Deno.test("Rate limiter should block requests after 5 attempts", async () => {
    const serverProcess = startServer();
    await delay(5000); // Wait for server to start

    const loginUrl = "http://localhost:8000/login";
    const loginBody = {
        username: "test",
        password: "password"
    };

    let response;
    // First 5 attempts should be allowed
    for (let i = 0; i < 5; i++) {
        response = await fetch(loginUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginBody)
        });
        // These will fail because the user doesn't exist, but that's fine.
        // We just need to check that the rate limiter isn't blocking them.
        assert(response.status !== 429, `Request ${i+1} should not be rate limited`);
    }

    // 6th attempt should be blocked
    response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginBody)
    });
    assertEquals(response.status, 429, "6th request should be rate limited");

    // Wait for the rate limit to reset
    await delay(60000);

    // 7th attempt should be allowed again
    response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginBody)
    });
    assert(response.status !== 429, "Request after TTL should not be rate limited");


    serverProcess.kill();
});
